"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SixLayerEnginePage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "implementation" | "patterns" | "examples"
  >("overview");

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">📚 Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#architecture">🏗️ Architecture</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">6-Layer Rule Engine</span>
        </div>

        <h1 className="docs-page-title">🏗️ 6-Layer Rule Engine</h1>
        <p className="docs-page-subtitle">
          Sequential execution and dependency management system powering
          NeuroLint Pro's deterministic transformations
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 12 min read</span>
          <span className="docs-meta-item difficulty-advanced">
            🔴 Advanced
          </span>
          <span className="docs-meta-item layer-badge">🏗️ Architecture</span>
          <span className="docs-meta-item">📝 Last updated: Dec 2024</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="docs-tab-nav">
        <button
          className={`docs-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Overview
        </button>
        <button
          className={`docs-tab ${activeTab === "implementation" ? "active" : ""}`}
          onClick={() => setActiveTab("implementation")}
        >
          🛠️ Implementation
        </button>
        <button
          className={`docs-tab ${activeTab === "patterns" ? "active" : ""}`}
          onClick={() => setActiveTab("patterns")}
        >
          📐 Patterns
        </button>
        <button
          className={`docs-tab ${activeTab === "examples" ? "active" : ""}`}
          onClick={() => setActiveTab("examples")}
        >
          💻 Examples
        </button>
      </div>

      <div className="docs-page-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Core Architecture */}
            <div className="docs-section">
              <h2 id="core-architecture">🏗️ Core Architecture Principles</h2>

              <div className="docs-highlight-box info">
                <h3>🎯 Rule Engine Philosophy</h3>
                <p>
                  NeuroLint Pro's 6-layer engine is built on{" "}
                  <strong>deterministic rule-based transformations</strong>
                  with sequential execution, dependency management, and
                  comprehensive safety mechanisms. Each layer builds upon the
                  previous one's foundation, ensuring systematic and safe code
                  improvements.
                </p>
              </div>

              <div className="docs-architecture-overview">
                <div className="docs-layer-flow">
                  <div className="docs-layer-item foundation">
                    <div className="docs-layer-number">1</div>
                    <div className="docs-layer-content">
                      <h4>🔧 Configuration Fixes</h4>
                      <p>Foundation setup and configuration modernization</p>
                      <div className="docs-layer-tech">
                        Regex + JSON parsing
                      </div>
                    </div>
                    <div className="docs-layer-deps">Dependencies: None</div>
                  </div>
                  <div className="docs-flow-arrow">↓</div>

                  <div className="docs-layer-item cleanup">
                    <div className="docs-layer-number">2</div>
                    <div className="docs-layer-content">
                      <h4>🧹 Pattern Fixes</h4>
                      <p>HTML entity cleanup and legacy pattern updates</p>
                      <div className="docs-layer-tech">
                        Advanced Regex + Context Analysis
                      </div>
                    </div>
                    <div className="docs-layer-deps">Dependencies: Layer 1</div>
                  </div>
                  <div className="docs-flow-arrow">↓</div>

                  <div className="docs-layer-item react">
                    <div className="docs-layer-number">3</div>
                    <div className="docs-layer-content">
                      <h4>⚛️ Component Fixes</h4>
                      <p>React component improvements and accessibility</p>
                      <div className="docs-layer-tech">
                        AST Analysis + Regex Fallback
                      </div>
                    </div>
                    <div className="docs-layer-deps">
                      Dependencies: Layers 1, 2
                    </div>
                  </div>
                  <div className="docs-flow-arrow">↓</div>

                  <div className="docs-layer-item ssr">
                    <div className="docs-layer-number">4</div>
                    <div className="docs-layer-content">
                      <h4>💧 Hydration Fixes</h4>
                      <p>SSR safety and hydration mismatch prevention</p>
                      <div className="docs-layer-tech">
                        AST Analysis + Pattern Detection
                      </div>
                    </div>
                    <div className="docs-layer-deps">
                      Dependencies: Layers 1, 2, 3
                    </div>
                  </div>
                  <div className="docs-flow-arrow">↓</div>

                  <div className="docs-layer-item nextjs">
                    <div className="docs-layer-number">5</div>
                    <div className="docs-layer-content">
                      <h4>🚀 Next.js App Router</h4>
                      <p>App Router compatibility and optimization</p>
                      <div className="docs-layer-tech">
                        AST + Import Analysis
                      </div>
                    </div>
                    <div className="docs-layer-deps">
                      Dependencies: Layers 1-4
                    </div>
                  </div>
                  <div className="docs-flow-arrow">↓</div>

                  <div className="docs-layer-item quality">
                    <div className="docs-layer-number">6</div>
                    <div className="docs-layer-content">
                      <h4>🛡️ Testing & Validation</h4>
                      <p>Error boundaries and final quality improvements</p>
                      <div className="docs-layer-tech">
                        Comprehensive Analysis
                      </div>
                    </div>
                    <div className="docs-layer-deps">
                      Dependencies: Layers 1-5
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Strategy */}
            <div className="docs-section">
              <h2 id="execution-strategy">⚙️ Sequential Execution Strategy</h2>

              <div className="docs-execution-principles">
                <div className="docs-principle-item">
                  <h4>📐 Deterministic Order</h4>
                  <p>
                    Layers execute in strict order (1→2→3→4→5→6) to ensure
                    consistent results
                  </p>
                </div>

                <div className="docs-principle-item">
                  <h4>🔗 Dependency Validation</h4>
                  <p>
                    Each layer validates that its dependencies have completed
                    successfully
                  </p>
                </div>

                <div className="docs-principle-item">
                  <h4>🛡️ Fail-Safe Execution</h4>
                  <p>
                    Layer failures don't prevent subsequent layers from
                    attempting execution
                  </p>
                </div>

                <div className="docs-principle-item">
                  <h4>📊 State Tracking</h4>
                  <p>
                    Complete state history maintained for debugging and rollback
                    capabilities
                  </p>
                </div>
              </div>
            </div>

            {/* Transformation Technologies */}
            <div className="docs-section">
              <h2 id="transformation-tech">🔧 Transformation Technologies</h2>

              <div className="docs-tech-grid">
                <div className="docs-tech-item">
                  <h4>📝 Regex-Based (Layers 1-2)</h4>
                  <div className="docs-tech-details">
                    <p>
                      <strong>Use Case:</strong> Configuration files, simple
                      pattern fixes
                    </p>
                    <p>
                      <strong>Advantages:</strong> Fast, reliable, predictable
                    </p>
                    <p>
                      <strong>Examples:</strong> JSON updates, HTML entity fixes
                    </p>
                  </div>
                </div>

                <div className="docs-tech-item">
                  <h4>🌳 AST-First (Layers 3-6)</h4>
                  <div className="docs-tech-details">
                    <p>
                      <strong>Use Case:</strong> React components, complex
                      transformations
                    </p>
                    <p>
                      <strong>Advantages:</strong> Semantic understanding,
                      precise modifications
                    </p>
                    <p>
                      <strong>Examples:</strong> JSX prop additions, component
                      analysis
                    </p>
                  </div>
                </div>

                <div className="docs-tech-item">
                  <h4>🔄 Hybrid Approach</h4>
                  <div className="docs-tech-details">
                    <p>
                      <strong>Use Case:</strong> When AST parsing fails
                    </p>
                    <p>
                      <strong>Advantages:</strong> Graceful degradation, maximum
                      coverage
                    </p>
                    <p>
                      <strong>Examples:</strong> Fallback to regex when AST
                      fails
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Mechanisms */}
            <div className="docs-section">
              <h2 id="safety-mechanisms">🛡️ Comprehensive Safety Mechanisms</h2>

              <div className="docs-safety-overview">
                <div className="docs-safety-category">
                  <h4>🔍 Pre-Execution Validation</h4>
                  <ul>
                    <li>Dependency availability checking</li>
                    <li>File accessibility verification</li>
                    <li>Syntax pre-validation</li>
                    <li>Resource availability confirmation</li>
                  </ul>
                </div>

                <div className="docs-safety-category">
                  <h4>⚡ Runtime Protection</h4>
                  <ul>
                    <li>Incremental transformation validation</li>
                    <li>Corruption pattern detection</li>
                    <li>Automatic rollback on failure</li>
                    <li>Memory and timeout management</li>
                  </ul>
                </div>

                <div className="docs-safety-category">
                  <h4>📊 Post-Execution Verification</h4>
                  <ul>
                    <li>Syntax correctness validation</li>
                    <li>Logical integrity checking</li>
                    <li>Performance impact assessment</li>
                    <li>Quality metric evaluation</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Implementation Tab */}
        {activeTab === "implementation" && (
          <>
            <div className="docs-section">
              <h2>🛠️ Engine Implementation Details</h2>

              <div className="docs-code-block">
                <h3>Core Orchestrator Interface</h3>
                <pre>
                  <code>{`interface LayerExecutionEngine {
  // Core execution method
  async executeLayer(
    layerId: number,
    code: string,
    options: ExecutionOptions
  ): Promise<LayerResult>;
  
  // Sequential orchestration
  async executeLayers(
    code: string,
    enabledLayers: number[],
    options: OrchestrationOptions
  ): Promise<OrchestrationResult>;
  
  // Dependency management
  validateDependencies(
    requestedLayers: number[]
  ): DependencyValidationResult;
  
  // State management
  trackState(state: TransformationState): void;
  rollbackToState(stateId: string): TransformationState;
}

interface LayerResult {
  success: boolean;
  code: string;
  executionTime: number;
  changeCount: number;
  improvements: string[];
  error?: string;
  revertReason?: string;
}

interface OrchestrationResult {
  finalCode: string;
  originalCode: string;
  layerResults: LayerResult[];
  totalExecutionTime: number;
  successfulLayers: number;
  metadata: OrchestrationMetadata;
}`}</code>
                </pre>
              </div>

              <div className="docs-code-block">
                <h3>Layer Dependency System</h3>
                <pre>
                  <code>{`class LayerDependencyManager {
  private static readonly DEPENDENCIES = {
    1: [], // Configuration has no dependencies
    2: [1], // Pattern cleanup depends on config
    3: [1, 2], // Components depend on config + cleanup
    4: [1, 2, 3], // Hydration depends on all previous
    5: [1, 2, 3, 4], // Next.js depends on all previous
    6: [1, 2, 3, 4, 5], // Testing depends on all previous
  };
  
  static validateAndCorrectLayers(
    requestedLayers: number[]
  ): DependencyResult {
    const correctedLayers = [...requestedLayers];
    const warnings: string[] = [];
    const autoAdded: number[] = [];
    
    for (const layerId of requestedLayers) {
      const dependencies = this.DEPENDENCIES[layerId] || [];
      const missingDeps = dependencies.filter(
        dep => !correctedLayers.includes(dep)
      );
      
      if (missingDeps.length > 0) {
        correctedLayers.push(...missingDeps);
        autoAdded.push(...missingDeps);
        warnings.push(
          \`Layer \${layerId} requires \${missingDeps.join(', ')}. Auto-added.\`
        );
      }
    }
    
    return {
      correctedLayers: [...new Set(correctedLayers)].sort(),
      warnings,
      autoAdded
    };
  }
}`}</code>
                </pre>
              </div>

              <div className="docs-code-block">
                <h3>Safe Execution Pipeline</h3>
                <pre>
                  <code>{`class SafeExecutionPipeline {
  async executeLayers(
    code: string, 
    enabledLayers: number[], 
    options: ExecutionOptions
  ): Promise<PipelineResult> {
    let current = code;
    const results: LayerResult[] = [];
    const states: string[] = [code];
    
    for (const layerId of enabledLayers) {
      const previous = current;
      const startTime = performance.now();
      
      try {
        // Execute transformation
        const transformed = await this.executeLayer(layerId, current, options);
        
        // Validate transformation safety
        const validation = this.validateTransformation(previous, transformed);
        
        if (validation.shouldRevert) {
          console.warn(\`⚠️ Reverting Layer \${layerId}: \${validation.reason}\`);
          current = previous; // Rollback to safe state
          
          results.push({
            layerId,
            success: false,
            code: previous,
            executionTime: performance.now() - startTime,
            revertReason: validation.reason
          });
        } else {
          current = transformed; // Accept changes
          states.push(current);
          
          results.push({
            layerId,
            success: true,
            code: current,
            executionTime: performance.now() - startTime,
            changeCount: this.calculateChanges(previous, transformed),
            improvements: this.detectImprovements(previous, transformed)
          });
        }
        
      } catch (error) {
        console.error(\`❌ Layer \${layerId} failed:\`, error.message);
        
        results.push({
          layerId,
          success: false,
          code: previous, // Keep previous safe state
          executionTime: performance.now() - startTime,
          error: error.message
        });
      }
    }
    
    return {
      finalCode: current,
      results,
      states,
      totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      successfulLayers: results.filter(r => r.success).length
    };
  }
}`}</code>
                </pre>
              </div>
            </div>
          </>
        )}

        {/* Patterns Tab */}
        {activeTab === "patterns" && (
          <>
            <div className="docs-section">
              <h2>📐 Implementation Patterns</h2>

              <div className="docs-pattern-group">
                <h3>🔄 AST vs Regex Fallback Strategy</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`class TransformationStrategy {
  async transformWithFallback(
    code: string, 
    layer: LayerConfig
  ): Promise<string> {
    
    // Layers 1-2: Always use regex (config files, simple patterns)
    if (!layer.supportsAST) {
      return await layer.regexTransform(code);
    }
    
    // Layers 3-6: Try AST first, fallback to regex
    try {
      if (layer.supportsAST) {
        console.log(\`🌳 Using AST transformation for \${layer.name}\`);
        return await this.transformWithAST(code, layer);
      }
    } catch (astError) {
      console.warn(
        \`⚠️ AST failed for \${layer.name}, using regex fallback:\`, 
        astError.message
      );
      
      // AST failed, use regex-based transformation
      if (layer.regexTransform) {
        return await layer.regexTransform(code);
      } else {
        throw new Error(\`No fallback available for layer \${layer.name}\`);
      }
    }
    
    return code;
  }
  
  async transformWithAST(code: string, layer: LayerConfig): Promise<string> {
    const transformer = new ASTTransformer({
      preserveComments: true,
      plugins: ['typescript', 'jsx']
    });
    
    // Parse code to AST
    const ast = transformer.parse(code);
    if (!ast) {
      throw new Error('Failed to parse code to AST');
    }
    
    // Apply layer-specific AST transformations
    switch (layer.id) {
      case 3:
        await this.applyComponentTransformations(ast);
        break;
      case 4:
        await this.applyHydrationTransformations(ast);
        break;
      case 5:
        await this.applyNextJSTransformations(ast);
        break;
      case 6:
        await this.applyQualityTransformations(ast);
        break;
      default:
        throw new Error(\`AST not supported for layer \${layer.id}\`);
    }
    
    // Generate code from modified AST
    return transformer.generate(ast);
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="docs-pattern-group">
                <h3>✅ Incremental Validation System</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`class TransformationValidator {
  static validateTransformation(
    before: string, 
    after: string
  ): ValidationResult {
    // Skip validation if no changes were made
    if (before === after) {
      return { shouldRevert: false, reason: 'No changes made' };
    }
    
    // Check for syntax validity
    const syntaxCheck = this.validateSyntax(after);
    if (!syntaxCheck.valid) {
      return { 
        shouldRevert: true, 
        reason: \`Syntax error: \${syntaxCheck.error}\` 
      };
    }
    
    // Check for code corruption patterns
    const corruptionCheck = this.detectCorruption(before, after);
    if (corruptionCheck.detected) {
      return { 
        shouldRevert: true, 
        reason: \`Corruption detected: \${corruptionCheck.pattern}\` 
      };
    }
    
    // Check for logical issues
    const logicalCheck = this.validateLogicalIntegrity(before, after);
    if (!logicalCheck.valid) {
      return { 
        shouldRevert: true, 
        reason: \`Logical issue: \${logicalCheck.reason}\` 
      };
    }
    
    return { shouldRevert: false };
  }
  
  private static validateSyntax(code: string): SyntaxResult {
    try {
      // Use Babel parser for comprehensive syntax checking
      parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
        allowImportExportEverywhere: true,
        strictMode: false
      });
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown syntax error' 
      };
    }
  }
  
  private static detectCorruption(
    before: string, 
    after: string
  ): CorruptionResult {
    const corruptionPatterns = [
      {
        name: 'Double function calls',
        regex: /onClick=\\{[^}]*\\([^)]*\\)\\s*=>\\s*\\(\\)\\s*=>/g
      },
      {
        name: 'Malformed event handlers',
        regex: /onClick=\\{[^}]*\\)\\([^)]*\\)$/g
      },
      {
        name: 'Invalid JSX attributes',
        regex: /\\w+=\\{[^}]*\\)[^}]*\\}/g
      },
      {
        name: 'Broken import statements',
        regex: /import\\s*{\\s*\\n\\s*import\\s*{/g
      }
    ];
    
    for (const pattern of corruptionPatterns) {
      // Check if pattern exists in after but not before
      if (pattern.regex.test(after) && !pattern.regex.test(before)) {
        return { 
          detected: true, 
          pattern: pattern.name 
        };
      }
    }
    
    return { detected: false };
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="docs-pattern-group">
                <h3>📊 Performance Optimization</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`class PerformanceOptimizer {
  private static cache = new Map<string, string>();
  private static readonly CACHE_SIZE_LIMIT = 100;
  
  static async executeOptimized(
    code: string, 
    layers: number[], 
    options: OptimizationOptions = {}
  ): Promise<OptimizedResult> {
    
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = this.generateCacheKey(code, layers);
    if (options.useCache && this.cache.has(cacheKey)) {
      return {
        result: this.cache.get(cacheKey)!,
        fromCache: true,
        executionTime: performance.now() - startTime,
        optimizations: ['cache-hit']
      };
    }
    
    // Optimize layer order and selection
    const optimizedLayers = this.optimizeLayerSelection(code, layers);
    
    // Execute with performance monitoring
    const result = await this.executeWithMonitoring(code, optimizedLayers, options);
    
    // Cache successful results
    if (options.useCache && result.success) {
      this.cacheResult(cacheKey, result.code);
    }
    
    return {
      result: result.code,
      fromCache: false,
      executionTime: performance.now() - startTime,
      optimizations: result.optimizations,
      layerResults: result.layerResults
    };
  }
  
  private static optimizeLayerSelection(
    code: string, 
    requestedLayers: number[]
  ): number[] {
    const actuallyNeeded: number[] = [];
    
    for (const layerId of requestedLayers) {
      if (this.layerWillMakeChanges(code, layerId)) {
        actuallyNeeded.push(layerId);
      }
    }
    
    // Always include dependencies
    const withDependencies = LayerDependencyManager.validateAndCorrectLayers(
      actuallyNeeded
    );
    return withDependencies.correctedLayers;
  }
  
  private static layerWillMakeChanges(code: string, layerId: number): boolean {
    switch (layerId) {
      case 1: // Config
        return code.includes('tsconfig') || 
               code.includes('next.config') || 
               code.includes('package.json');
      
      case 2: // Patterns  
        return /&quot;|&amp;|&lt;|&gt;|console\\.log|var\\s+/.test(code);
      
      case 3: // Components
        return code.includes('map(') || 
               (code.includes('<img') && !code.includes('alt=')) ||
               (code.includes('useState') && !code.includes('import { useState'));
      
      case 4: // Hydration
        return code.includes('localStorage') && !code.includes('typeof window');
        
      case 5: // Next.js
        return code.includes('useState') && !code.includes('use client');
        
      case 6: // Testing
        return code.includes('export default function') && 
               !code.includes('ErrorBoundary');
      
      default:
        return true; // Conservative default
    }
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Examples Tab */}
        {activeTab === "examples" && (
          <>
            <div className="docs-section">
              <h2>💻 Complete Usage Examples</h2>

              <div className="docs-example-group">
                <h3>🎯 Basic Layer Execution</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`// Initialize the NeuroLint Pro engine
const neuroLint = new NeuroLintEngine({
  verbose: true,
  dryRun: false,
  enableCaching: true
});

// Simple single-layer execution
const layer1Result = await neuroLint.executeLayer(1, sourceCode, {
  targetFiles: ['tsconfig.json', 'next.config.js'],
  backupEnabled: true
});

console.log('Layer 1 Result:', {
  success: layer1Result.success,
  changes: layer1Result.changeCount,
  time: layer1Result.executionTime + 'ms'
});

// Full orchestration with all layers
const fullResult = await neuroLint.executeLayers(sourceCode, [1, 2, 3, 4, 5, 6], {
  dryRun: false,
  verbose: true,
  stopOnError: false
});

console.log('Full Orchestration:', {
  finalCode: fullResult.finalCode,
  successfulLayers: fullResult.successfulLayers,
  totalTime: fullResult.totalExecutionTime + 'ms',
  improvements: fullResult.layerResults.flatMap(r => r.improvements)
});`}</code>
                  </pre>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🔧 Advanced Configuration</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`// Advanced engine configuration
const advancedNeuroLint = new NeuroLintEngine({
  // Performance options
  enableCaching: true,
  maxCacheSize: 200,
  timeoutMs: 60000,
  
  // Safety options
  enableBackups: true,
  backupDirectory: './neurolint-backups',
  validateEachStep: true,
  
  // Execution options
  skipUnnecessaryLayers: true,
  enableParallelAnalysis: true,
  maxConcurrentFiles: 5,
  
  // Output options
  verbose: true,
  logLevel: 'info',
  reportFormat: 'detailed'
});

// Smart layer selection based on code analysis
const recommendation = await advancedNeuroLint.analyzeAndRecommend(sourceCode);
console.log('Recommended layers:', recommendation.recommendedLayers);
console.log('Detected issues:', recommendation.detectedIssues);

// Execute only recommended layers
const smartResult = await advancedNeuroLint.executeLayers(
  sourceCode, 
  recommendation.recommendedLayers,
  { 
    reason: 'Smart recommendation-based execution' 
  }
);`}</code>
                  </pre>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🛡️ Error Handling and Recovery</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`// Comprehensive error handling
class RobustNeuroLintExecution {
  async executeWithRecovery(code: string, layers: number[]) {
    const pipeline = new TransformationPipeline(code);
    
    try {
      const result = await pipeline.execute(layers, {
        enableRecovery: true,
        maxRetries: 3,
        fallbackStrategy: 'regex-only'
      });
      
      if (result.hasErrors) {
        console.warn('Some layers failed:', result.errors);
        
        // Attempt recovery with reduced layer set
        const safeLayers = layers.filter(id => 
          !result.failedLayers.includes(id)
        );
        
        if (safeLayers.length > 0) {
          console.log('Retrying with safe layers:', safeLayers);
          return await pipeline.execute(safeLayers, {
            conservative: true
          });
        }
      }
      
      return result;
      
    } catch (criticalError) {
      console.error('Critical execution failure:', criticalError);
      
      // Last resort: return original code with error report
      return {
        finalCode: code,
        success: false,
        error: criticalError.message,
        recommendation: 'Manual review required'
      };
    }
  }
  
  async validateResult(result: ExecutionResult): Promise<ValidationReport> {
    const validation = new QualityValidator();
    
    return {
      syntaxValid: await validation.checkSyntax(result.finalCode),
      noRegression: await validation.compareQuality(
        result.originalCode, 
        result.finalCode
      ),
      performanceImpact: await validation.measurePerformance(result),
      accessibilityScore: await validation.checkAccessibility(result.finalCode)
    };
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>📊 Custom Layer Implementation</h3>
                <div className="docs-code-block">
                  <pre>
                    <code>{`// Implementing a custom layer
class CustomSecurityLayer extends BaseLayer {
  layerId = 7;
  name = 'Security Enhancements';
  dependencies = [1, 2, 3, 4, 5, 6];
  
  async execute(code: string, options: LayerOptions): Promise<LayerResult> {
    const startTime = performance.now();
    const transformations: string[] = [];
    
    try {
      // Security-focused transformations
      let transformedCode = code;
      
      // Add CSP headers
      transformedCode = this.addContentSecurityPolicy(transformedCode);
      transformations.push('Added Content Security Policy');
      
      // Sanitize user inputs
      transformedCode = this.sanitizeInputs(transformedCode);
      transformations.push('Sanitized user inputs');
      
      // Add CSRF protection
      transformedCode = this.addCSRFProtection(transformedCode);
      transformations.push('Added CSRF protection');
      
      return {
        layerId: this.layerId,
        success: true,
        code: transformedCode,
        executionTime: performance.now() - startTime,
        changeCount: this.calculateChanges(code, transformedCode),
        improvements: transformations
      };
      
    } catch (error) {
      return {
        layerId: this.layerId,
        success: false,
        code: code, // Return original on failure
        executionTime: performance.now() - startTime,
        error: error.message
      };
    }
  }
  
  private addContentSecurityPolicy(code: string): string {
    // Implementation for adding CSP headers
    if (code.includes('next.config')) {
      return code.replace(
        /headers: async \(\) => \{/,
        \`headers: async () => {
          return [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'Content-Security-Policy',
                  value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
                }
              ]
            }
          ];\`
      );
    }
    return code;
  }
}

// Register and use custom layer
const customEngine = new NeuroLintEngine();
customEngine.registerLayer(new CustomSecurityLayer());

const result = await customEngine.executeLayers(code, [1, 2, 3, 4, 5, 6, 7]);`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-6-testing"
            className="docs-nav-link prev"
          >
            ← Layer 6: Testing & Validation
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/architecture/ast-vs-regex"
            className="docs-nav-link next"
          >
            AST vs Regex Transformations →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .docs-page {
          min-height: 100vh;
          background: #000000;
          color: white;
          font-family: var(--font-sans, "Inter", sans-serif);
        }

        .docs-page-header {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.08) 0%,
            rgba(0, 0, 0, 0.95) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
        }

        .docs-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .docs-breadcrumb a {
          color: var(--status-info);
          text-decoration: none;
        }

        .docs-breadcrumb a:hover {
          text-decoration: underline;
        }

        .docs-breadcrumb-separator {
          color: rgba(255, 255, 255, 0.4);
        }

        .docs-breadcrumb-current {
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-page-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #2196f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .docs-page-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .docs-page-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .docs-meta-item {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .difficulty-advanced {
          color: var(--status-error);
          border-color: rgba(229, 62, 62, 0.3);
          background: rgba(229, 62, 62, 0.1);
        }

        .layer-badge {
          color: var(--status-info);
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.1);
        }

        .docs-tab-nav {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 40px;
          display: flex;
          gap: 8px;
        }

        .docs-tab {
          padding: 16px 24px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .docs-tab:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        .docs-tab.active {
          color: var(--status-info);
          border-bottom-color: var(--status-info);
          background: rgba(33, 150, 243, 0.1);
        }

        .docs-page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
          line-height: 1.7;
        }

        .docs-section {
          margin-bottom: 60px;
        }

        .docs-section h2 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: white;
        }

        .docs-section h3 {
          font-size: 24px;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: white;
        }

        .docs-section h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: white;
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-highlight-box {
          padding: 24px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid;
        }

        .docs-highlight-box.info {
          background: rgba(33, 150, 243, 0.1);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-architecture-overview {
          margin: 40px 0;
        }

        .docs-layer-flow {
          margin: 32px 0;
        }

        .docs-layer-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 8px;
          position: relative;
        }

        .docs-layer-item.foundation {
          border-color: var(--status-info);
          background: rgba(33, 150, 243, 0.05);
        }

        .docs-layer-item.cleanup {
          border-color: var(--status-processing);
          background: rgba(255, 152, 0, 0.05);
        }

        .docs-layer-item.react {
          border-color: #61dafb;
          background: rgba(97, 218, 251, 0.05);
        }

        .docs-layer-item.ssr {
          border-color: #00bcd4;
          background: rgba(0, 188, 212, 0.05);
        }

        .docs-layer-item.nextjs {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.02);
        }

        .docs-layer-item.quality {
          border-color: var(--status-active);
          background: rgba(76, 175, 80, 0.05);
        }

        .docs-layer-number {
          width: 48px;
          height: 48px;
          background: var(--status-info);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .docs-layer-content {
          flex: 1;
        }

        .docs-layer-content h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        .docs-layer-content p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-layer-tech {
          font-size: 12px;
          color: var(--status-info);
          font-family: "Monaco", "Menlo", monospace;
          background: rgba(33, 150, 243, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        .docs-layer-deps {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-align: right;
          min-width: 120px;
        }

        .docs-flow-arrow {
          text-align: center;
          font-size: 24px;
          color: var(--status-info);
          margin: 8px 0;
          font-weight: bold;
        }

        .docs-execution-principles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-principle-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-principle-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-principle-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-tech-item {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-tech-item h4 {
          margin: 0 0 16px 0;
          font-size: 18px;
        }

        .docs-tech-details p {
          margin: 8px 0;
          font-size: 14px;
        }

        .docs-tech-details strong {
          color: var(--status-info);
        }

        .docs-safety-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-safety-category {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-safety-category h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
        }

        .docs-safety-category ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-safety-category li {
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-code-block {
          margin: 32px 0;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .docs-code-block h3 {
          background: rgba(33, 150, 243, 0.1);
          color: var(--status-info);
          margin: 0;
          padding: 16px 20px;
          font-size: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-code-block pre {
          margin: 0;
          padding: 20px;
          overflow-x: auto;
        }

        .docs-code-block code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-pattern-group {
          margin: 40px 0;
        }

        .docs-pattern-group h3 {
          margin: 0 0 20px 0;
          font-size: 22px;
          color: white;
        }

        .docs-example-group {
          margin: 40px 0;
        }

        .docs-example-group h3 {
          margin: 0 0 20px 0;
          font-size: 22px;
          color: white;
        }

        .docs-page-nav {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          display: flex;
          justify-content: space-between;
        }

        .docs-nav-link {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          text-decoration: none;
          color: white;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .docs-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.9em;
        }

        strong {
          color: white;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .docs-page-header,
          .docs-page-content,
          .docs-page-nav {
            padding-left: 20px;
            padding-right: 20px;
          }

          .docs-tab-nav {
            padding-left: 20px;
            padding-right: 20px;
            overflow-x: auto;
          }

          .docs-page-title {
            font-size: 36px;
          }

          .docs-layer-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .docs-layer-deps {
            text-align: left;
            min-width: auto;
          }

          .docs-page-nav {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
