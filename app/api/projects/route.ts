import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { dataStore } from "../../../lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId") || "demo-user";

    if (projectId) {
      // Get specific project
      const project = dataStore.projects.get(projectId);
      if (!project || project.userId !== userId) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }

      // Include recent analyses
      const analyses = dataStore.projectAnalyses.get(projectId) || [];
      return NextResponse.json({
        ...project,
        analyses: analyses.slice(-10), // Last 10 analyses
        totalAnalyses: analyses.length,
      });
    }

    // Get all projects for user
    const userProjects = Array.from(dataStore.projects.values()).filter(
      (p) => p.userId === userId,
    );

    return NextResponse.json({
      projects: userProjects,
      total: userProjects.length,
    });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, gitUrl, framework, userId = "demo-user" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const project = {
      id: projectId,
      name,
      description: description || "",
      gitUrl: gitUrl || null,
      framework: framework || "react",
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: [],
      settings: {
        defaultLayers: [],
        autoAnalyze: false,
        notifications: true,
      },
      stats: {
        totalFiles: 0,
        totalIssues: 0,
        lastAnalyzed: null,
        qualityScore: 0,
      },
    };

    dataStore.projects.set(projectId, project);
    dataStore.projectAnalyses.set(projectId, []);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, updates, userId = "demo-user" } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const project = dataStore.projects.get(projectId);
    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    dataStore.projects.set(projectId, updatedProject);

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId") || "demo-user";

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const project = dataStore.projects.get(projectId);
    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    dataStore.projects.delete(projectId);
    dataStore.projectAnalyses.delete(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
