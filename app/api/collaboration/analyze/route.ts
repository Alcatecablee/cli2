import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, layers, dryRun = true } = body;
    const userId = request.headers.get("x-user-id");

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // Verify user is active participant
    const { data: participant, error: participantError } = await supabase
      .from("collaboration_participants")
      .select("is_active, user_name")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (participantError || !participant) {
      return NextResponse.json(
        { error: "Not an active participant" },
        { status: 403 },
      );
    }

    // Get current session content
    const { data: session, error: sessionError } = await supabase
      .from("collaboration_sessions")
      .select("document_content, document_filename, document_language")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (
      !session.document_content ||
      session.document_content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "No code to analyze" },
        { status: 400 },
      );
    }

    // Import NeuroLint Pro
    let NeuroLintPro;
    try {
      NeuroLintPro = require("../../../../neurolint-pro");
    } catch (error) {
      console.error("Failed to import NeuroLint Pro:", error);
      return NextResponse.json(
        { error: "Analysis engine not available" },
        { status: 500 },
      );
    }

    const startTime = Date.now();

    try {
      // Run NeuroLint Pro analysis
      const analysisResult = await NeuroLintPro(
        session.document_content,
        session.document_filename,
        dryRun,
        layers,
        {
          verbose: false,
          isDemoMode: true,
          onProgress: (progress) => {
            // Could emit real-time progress via Supabase realtime here
            console.log("Analysis progress:", progress);
          },
        },
      );

      const executionTime = Date.now() - startTime;

      // Store analysis result
      const { data: storedAnalysis, error: storeError } = await supabase
        .from("collaboration_analysis")
        .insert({
          session_id: sessionId,
          triggered_by: userId,
          input_code: session.document_content,
          output_code: analysisResult.transformed || analysisResult.finalCode,
          layers_executed:
            layers || analysisResult.results?.map((r) => r.layerId) || [],
          dry_run: dryRun,
          success: analysisResult.success !== false,
          execution_time: executionTime,
          detected_issues:
            analysisResult.detectedIssues ||
            analysisResult.analysis?.detectedIssues ||
            [],
          analysis_results: {
            layers: analysisResult.results || analysisResult.layers || [],
            summary: analysisResult.summary || {},
            confidence: analysisResult.analysis?.confidence || 0.8,
            estimatedImpact: analysisResult.analysis?.estimatedImpact || {
              level: "medium",
            },
          },
          error_message: analysisResult.error || null,
        })
        .select()
        .single();

      if (storeError) {
        console.error("Failed to store analysis:", storeError);
      }

      // Add system comment about analysis
      await supabase.from("collaboration_comments").insert({
        session_id: sessionId,
        user_id: userId,
        author_name: "NeuroLint Pro",
        content: `Analysis completed by ${participant.user_name}: ${analysisResult.detectedIssues?.length || 0} issues found`,
        line_number: 0,
        comment_type: "system",
      });

      // If not dry run and analysis was successful, apply changes
      if (!dryRun && analysisResult.success && analysisResult.transformed) {
        if (analysisResult.transformed !== session.document_content) {
          // Update document content
          await supabase
            .from("collaboration_sessions")
            .update({
              document_content: analysisResult.transformed,
              updated_at: new Date().toISOString(),
              last_activity: new Date().toISOString(),
            })
            .eq("id", sessionId);

          // Create operation for the transformation
          const { data: lastOp } = await supabase
            .from("collaboration_operations")
            .select("revision")
            .eq("session_id", sessionId)
            .order("revision", { ascending: false })
            .limit(1)
            .single();

          const newRevision = (lastOp?.revision || 0) + 1;

          await supabase.from("collaboration_operations").insert({
            session_id: sessionId,
            user_id: userId,
            operation_type: "replace",
            position: 0,
            content: analysisResult.transformed,
            old_length: session.document_content.length,
            base_revision: lastOp?.revision || 0,
            revision: newRevision,
            metadata: {
              type: "neurolint_transform",
              layers: layers,
              execution_time: executionTime,
              issues_fixed: analysisResult.detectedIssues?.length || 0,
            },
          });
        }
      }

      // Format response for frontend
      const response = {
        id: storedAnalysis?.id || "temp-" + Date.now(),
        success: analysisResult.success !== false,
        dryRun,
        layers: layers || analysisResult.results?.map((r) => r.layerId) || [],
        originalCode: session.document_content,
        transformed:
          analysisResult.transformed ||
          analysisResult.finalCode ||
          session.document_content,
        totalExecutionTime: executionTime,
        successfulLayers:
          analysisResult.results?.filter((r) => r.success).length ||
          analysisResult.successfulLayers ||
          0,
        analysis: {
          recommendedLayers:
            analysisResult.analysis?.recommendedLayers || layers || [],
          detectedIssues:
            analysisResult.detectedIssues ||
            analysisResult.analysis?.detectedIssues ||
            [],
          confidence: analysisResult.analysis?.confidence || 0.8,
          estimatedImpact: analysisResult.analysis?.estimatedImpact || {
            level: "medium",
            description: "Analysis completed",
            estimatedFixTime: "30 seconds",
          },
        },
        layers: analysisResult.results || analysisResult.layers || [],
        triggeredBy: userId,
        timestamp: new Date().toISOString(),
        error: analysisResult.error || null,
      };

      return NextResponse.json({
        success: true,
        result: response,
      });
    } catch (analysisError) {
      console.error("NeuroLint analysis error:", analysisError);

      // Store failed analysis
      await supabase.from("collaboration_analysis").insert({
        session_id: sessionId,
        triggered_by: userId,
        input_code: session.document_content,
        layers_executed: layers || [],
        dry_run: dryRun,
        success: false,
        execution_time: Date.now() - startTime,
        error_message: analysisError.message || "Analysis failed",
      });

      return NextResponse.json({
        success: false,
        error: analysisError.message || "Analysis failed",
        result: {
          id: "error-" + Date.now(),
          success: false,
          error: analysisError.message || "Analysis failed",
          triggeredBy: userId,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Collaboration analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = request.headers.get("x-user-id");

    if (!userId || !sessionId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify user is participant
    const { data: participant } = await supabase
      .from("collaboration_participants")
      .select("is_active")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "Not an active participant" },
        { status: 403 },
      );
    }

    // Get analysis history
    const { data: analyses, error } = await supabase
      .from("collaboration_analysis")
      .select(
        `
        *,
        collaboration_participants!triggered_by(user_name, user_color)
      `,
      )
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch analysis history" },
        { status: 500 },
      );
    }

    // Format for frontend
    const formattedAnalyses = (analyses || []).map((analysis) => ({
      id: analysis.id,
      success: analysis.success,
      dryRun: analysis.dry_run,
      layers: analysis.layers_executed,
      originalCode: analysis.input_code,
      transformed: analysis.output_code,
      totalExecutionTime: analysis.execution_time,
      analysis: {
        detectedIssues: analysis.detected_issues,
        ...analysis.analysis_results,
      },
      triggeredBy: analysis.triggered_by,
      triggeredByName: analysis.collaboration_participants?.user_name,
      timestamp: analysis.created_at,
      error: analysis.error_message,
    }));

    return NextResponse.json({
      analyses: formattedAnalyses,
    });
  } catch (error) {
    console.error("Get analysis history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
