/**
 * Enhanced AST Transformation Engine for NeuroLint Pro
 *
 * Implements sophisticated semantic analysis and type-aware transformations
 * while maintaining compatibility with existing IMPLEMENTATION_PATTERNS.md
 *
 * CRITICAL: Follows Safe Layer Execution Pattern and Incremental Validation System
 */

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

/**
 * Enhanced AST Transformation Engine
 * Provides semantic code understanding beyond pattern matching
 */
class EnhancedASTEngine {
  constructor(options = {}) {
    this.options = {
      preserveComments: true,
      retainLines: true,
      plugins: ["typescript", "jsx", "decorators-legacy"],
      sourceType: "module",
      allowImportExportEverywhere: true,
      strictMode: false,
      ...options,
    };

    // Track transformations for validation
    this.transformationLog = [];
    this.semanticContext = new Map();
  }

  /**
   * Parse code to AST with comprehensive error handling
   * Follows IMPLEMENTATION_PATTERNS.md AST vs Regex Fallback Strategy
   */
  parseCode(code, filename = "unknown.tsx") {
    try {
      console.log(`[AST ENGINE] Parsing ${filename}...`);

      const ast = parser.parse(code, this.options);

      // Build semantic context
      this.buildSemanticContext(ast, filename);

      return {
        success: true,
        ast,
        originalCode: code,
        filename,
      };
    } catch (error) {
      console.warn(`[AST ENGINE] Parse failed for ${filename}:`, error.message);
      return {
        success: false,
        error: error.message,
        fallbackToRegex: true,
        originalCode: code,
        filename,
      };
    }
  }

  /**
   * Build semantic context from AST
   * Understanding component relationships, imports, types, etc.
   */
  buildSemanticContext(ast, filename) {
    const context = {
      filename,
      imports: new Map(),
      exports: new Map(),
      components: new Map(),
      hooks: new Map(),
      types: new Map(),
      stateVariables: new Set(),
      props: new Map(),
      dependencies: new Set(),
    };

    traverse(ast, {
      // Track imports
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const specifiers = path.node.specifiers.map((spec) => {
          if (t.isImportDefaultSpecifier(spec)) {
            return { type: "default", name: spec.local.name };
          } else if (t.isImportSpecifier(spec)) {
            return {
              type: "named",
              name: spec.local.name,
              imported: spec.imported.name,
            };
          } else if (t.isImportNamespaceSpecifier(spec)) {
            return { type: "namespace", name: spec.local.name };
          }
        });

        context.imports.set(source, specifiers);

        // Track framework dependencies
        if (source.includes("react") || source.includes("next")) {
          context.dependencies.add(source);
        }
      },

      // Track React components
      FunctionDeclaration(path) {
        if (this.isReactComponent(path)) {
          const componentName = path.node.id.name;
          context.components.set(componentName, {
            type: "function",
            params: path.node.params,
            hasHooks: this.findHooks(path),
            propsType: this.inferPropsType(path),
            isExported: this.isExported(path),
          });
        }
      },

      // Track React functional components (arrow functions)
      VariableDeclarator(path) {
        if (this.isReactComponentVariable(path)) {
          const componentName = path.node.id.name;
          context.components.set(componentName, {
            type: "arrow",
            hasHooks: this.findHooks(path),
            propsType: this.inferPropsType(path),
            isExported: this.isExported(path.parent),
          });
        }
      },

      // Track React hooks usage
      CallExpression(path) {
        if (this.isHookCall(path)) {
          const hookName = path.node.callee.name;
          if (!context.hooks.has(hookName)) {
            context.hooks.set(hookName, []);
          }
          context.hooks.get(hookName).push({
            arguments: path.node.arguments,
            location: path.node.loc,
          });

          // Track state variables from useState
          if (hookName === "useState" && t.isArrayPattern(path.parent.id)) {
            const stateVar = path.parent.id.elements[0];
            if (t.isIdentifier(stateVar)) {
              context.stateVariables.add(stateVar.name);
            }
          }
        }
      },

      // Track TypeScript interfaces and types
      TSInterfaceDeclaration(path) {
        context.types.set(path.node.id.name, {
          type: "interface",
          properties: path.node.body.body,
          exported: this.isExported(path),
        });
      },

      TSTypeAliasDeclaration(path) {
        context.types.set(path.node.id.name, {
          type: "alias",
          typeAnnotation: path.node.typeAnnotation,
          exported: this.isExported(path),
        });
      },
    });

    this.semanticContext.set(filename, context);
    return context;
  }

  /**
   * Enhanced transformation methods with semantic awareness
   */

  /**
   * Transform missing key props with semantic understanding
   * Understands data types and suggests appropriate key patterns
   */
  transformMissingKeys(ast, context) {
    const transformations = [];

    traverse(ast, {
      CallExpression(path) {
        // Find .map() calls that render JSX without keys
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.property, { name: "map" })
        ) {
          const mapCallback = path.node.arguments[0];
          if (
            t.isArrowFunctionExpression(mapCallback) ||
            t.isFunctionExpression(mapCallback)
          ) {
            // Check if callback returns JSX
            const body = mapCallback.body;
            let jsxElement = null;

            if (t.isJSXElement(body) || t.isJSXFragment(body)) {
              jsxElement = body;
            } else if (t.isBlockStatement(body)) {
              // Look for return statement with JSX
              for (const stmt of body.body) {
                if (
                  t.isReturnStatement(stmt) &&
                  (t.isJSXElement(stmt.argument) ||
                    t.isJSXFragment(stmt.argument))
                ) {
                  jsxElement = stmt.argument;
                  break;
                }
              }
            }

            if (jsxElement && !this.hasKeyProp(jsxElement)) {
              // Analyze the array data structure to suggest appropriate key
              const keyPattern = this.suggestKeyPattern(
                path,
                mapCallback,
                context,
              );

              transformations.push({
                type: "missing-key",
                location: jsxElement.loc,
                element: jsxElement,
                suggestedKey: keyPattern,
                confidence: keyPattern.confidence,
              });

              // Apply the transformation
              this.addKeyProp(jsxElement, keyPattern.expression);
            }
          }
        }
      },
    });

    return transformations;
  }

  /**
   * Suggest intelligent key patterns based on data analysis
   */
  suggestKeyPattern(mapPath, callback, context) {
    const itemParam = callback.params[0];
    const indexParam = callback.params[1];

    if (!itemParam) {
      return {
        expression: "index",
        confidence: 0.3,
        reason: "No item parameter found",
      };
    }

    const itemName = itemParam.name;

    // Analyze the mapped array to understand data structure
    const arrayNode = mapPath.node.callee.object;
    let confidence = 0.5;
    let keyExpression = "index";
    let reason = "Default index fallback";

    // Check for common ID patterns
    if (this.hasProperty(callback.body, itemName, "id")) {
      keyExpression = `${itemName}.id`;
      confidence = 0.9;
      reason = "Found id property";
    } else if (this.hasProperty(callback.body, itemName, "key")) {
      keyExpression = `${itemName}.key`;
      confidence = 0.9;
      reason = "Found key property";
    } else if (this.hasProperty(callback.body, itemName, "uuid")) {
      keyExpression = `${itemName}.uuid`;
      confidence = 0.8;
      reason = "Found uuid property";
    } else if (this.hasProperty(callback.body, itemName, "name")) {
      keyExpression = `${itemName}.name`;
      confidence = 0.6;
      reason = "Found name property (may not be unique)";
    } else if (indexParam) {
      keyExpression = indexParam.name;
      confidence = 0.4;
      reason = "Using index parameter";
    }

    return {
      expression: keyExpression,
      confidence,
      reason,
    };
  }

  /**
   * Enhanced import optimization with semantic understanding
   */
  transformImports(ast, context) {
    const transformations = [];
    const usedImports = new Set();
    const unusedImports = [];

    // First pass: find all identifier usage
    traverse(ast, {
      Identifier(path) {
        // Skip if it's part of an import declaration
        if (
          t.isImportSpecifier(path.parent) ||
          t.isImportDefaultSpecifier(path.parent)
        ) {
          return;
        }
        usedImports.add(path.node.name);
      },
    });

    // Second pass: check import usage
    traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const unusedSpecifiers = [];

        path.node.specifiers.forEach((spec) => {
          const localName = spec.local.name;

          if (!usedImports.has(localName)) {
            // Check for special cases (side-effect imports, etc.)
            if (
              !this.isSideEffectImport(source) &&
              !this.isTypeOnlyImport(spec)
            ) {
              unusedSpecifiers.push(spec);
            }
          }
        });

        if (unusedSpecifiers.length > 0) {
          if (unusedSpecifiers.length === path.node.specifiers.length) {
            // Remove entire import
            transformations.push({
              type: "remove-import",
              location: path.node.loc,
              source,
              action: () => path.remove(),
            });
          } else {
            // Remove only unused specifiers
            transformations.push({
              type: "clean-import",
              location: path.node.loc,
              source,
              unusedSpecifiers,
              action: () => {
                path.node.specifiers = path.node.specifiers.filter(
                  (spec) => !unusedSpecifiers.includes(spec),
                );
              },
            });
          }
        }
      },
    });

    return transformations;
  }

  /**
   * Framework-specific Next.js App Router optimizations
   */
  transformNextJsPatterns(ast, context) {
    const transformations = [];

    traverse(ast, {
      // Auto-add 'use client' for client-side features
      Program(path) {
        if (this.needsClientDirective(context)) {
          const hasClientDirective = path.node.directives.some(
            (directive) => directive.value.value === "use client",
          );

          if (!hasClientDirective) {
            transformations.push({
              type: "add-use-client",
              location: { line: 1, column: 0 },
              action: () => {
                path.node.directives.unshift(
                  t.directive(t.directiveLiteral("use client")),
                );
              },
            });
          }
        }
      },

      // Optimize localStorage usage with Next.js patterns
      CallExpression(path) {
        if (this.isLocalStorageCall(path) && !this.hasSSRGuard(path)) {
          transformations.push({
            type: "add-ssr-guard",
            location: path.node.loc,
            action: () => this.addSSRGuard(path),
          });
        }
      },
    });

    return transformations;
  }

  /**
   * Type-aware transformations leveraging TypeScript
   */
  transformWithTypeAwareness(ast, context) {
    const transformations = [];

    traverse(ast, {
      // Add missing prop types based on usage
      FunctionDeclaration(path) {
        if (this.isReactComponent(path) && !this.hasPropsType(path)) {
          const inferredProps = this.inferComponentProps(path, context);
          if (inferredProps.length > 0) {
            transformations.push({
              type: "add-props-interface",
              location: path.node.loc,
              inferredProps,
              action: () => this.addPropsInterface(path, inferredProps),
            });
          }
        }
      },

      // Optimize component based on prop types
      JSXElement(path) {
        const elementName = path.node.openingElement.name.name;
        if (this.isKnownComponent(elementName, context)) {
          const optimizations = this.suggestComponentOptimizations(
            path,
            context,
          );
          transformations.push(...optimizations);
        }
      },
    });

    return transformations;
  }

  /**
   * Generate transformed code with error handling
   * Follows IMPLEMENTATION_PATTERNS.md Safe Layer Execution Pattern
   */
  generateCode(ast, originalCode) {
    try {
      const result = generate(ast, {
        retainLines: this.options.retainLines,
        comments: this.options.preserveComments,
      });

      return {
        success: true,
        code: result.code,
        map: result.map,
      };
    } catch (error) {
      console.error("[AST ENGINE] Code generation failed:", error.message);
      return {
        success: false,
        error: error.message,
        fallbackCode: originalCode,
      };
    }
  }

  // Helper methods for semantic analysis

  isReactComponent(path) {
    if (!path.node.id) return false;

    const name = path.node.id.name;
    // React components start with uppercase
    if (!/^[A-Z]/.test(name)) return false;

    // Check if function returns JSX
    let hasJSXReturn = false;
    traverse(path.node, {
      ReturnStatement(returnPath) {
        if (
          t.isJSXElement(returnPath.node.argument) ||
          t.isJSXFragment(returnPath.node.argument)
        ) {
          hasJSXReturn = true;
        }
      },
    });

    return hasJSXReturn;
  }

  isReactComponentVariable(path) {
    if (!t.isIdentifier(path.node.id)) return false;

    const name = path.node.id.name;
    if (!/^[A-Z]/.test(name)) return false;

    // Check if assigned function returns JSX
    const init = path.node.init;
    if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
      return this.containsJSX(init.body);
    }

    return false;
  }

  isHookCall(path) {
    return (
      t.isIdentifier(path.node.callee) &&
      path.node.callee.name.startsWith("use") &&
      path.node.callee.name.length > 3
    );
  }

  hasKeyProp(jsxElement) {
    if (!t.isJSXElement(jsxElement)) return false;

    return jsxElement.openingElement.attributes.some(
      (attr) =>
        t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: "key" }),
    );
  }

  hasProperty(node, objectName, propertyName) {
    let found = false;

    traverse(node, {
      MemberExpression(path) {
        if (
          t.isIdentifier(path.node.object, { name: objectName }) &&
          t.isIdentifier(path.node.property, { name: propertyName })
        ) {
          found = true;
        }
      },
    });

    return found;
  }

  addKeyProp(jsxElement, keyExpression) {
    const keyAttr = t.jsxAttribute(
      t.jsxIdentifier("key"),
      t.jsxExpressionContainer(t.identifier(keyExpression)),
    );

    jsxElement.openingElement.attributes.unshift(keyAttr);
  }

  needsClientDirective(context) {
    // Needs 'use client' if uses hooks, browser APIs, or event handlers
    return (
      context.hooks.size > 0 ||
      context.dependencies.has("localStorage") ||
      context.dependencies.has("window") ||
      context.dependencies.has("document")
    );
  }

  isLocalStorageCall(path) {
    return (
      t.isMemberExpression(path.node.callee) &&
      t.isIdentifier(path.node.callee.object, { name: "localStorage" })
    );
  }

  hasSSRGuard(path) {
    // Check if already wrapped in typeof window check
    let current = path.parent;
    while (current) {
      if (
        t.isBinaryExpression(current) &&
        current.operator === "!==" &&
        t.isUnaryExpression(current.left) &&
        current.left.operator === "typeof" &&
        t.isIdentifier(current.left.argument, { name: "window" })
      ) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  addSSRGuard(path) {
    const guard = t.logicalExpression(
      "&&",
      t.binaryExpression(
        "!==",
        t.unaryExpression("typeof", t.identifier("window")),
        t.stringLiteral("undefined"),
      ),
      path.node,
    );

    path.replaceWith(guard);
  }

  containsJSX(node) {
    let hasJSX = false;
    traverse(node, {
      JSXElement() {
        hasJSX = true;
      },
      JSXFragment() {
        hasJSX = true;
      },
    });
    return hasJSX;
  }

  isExported(path) {
    return (
      t.isExportDefaultDeclaration(path.parent) ||
      t.isExportNamedDeclaration(path.parent)
    );
  }

  isSideEffectImport(source) {
    // Common side-effect only imports
    return (
      [".css", ".scss", ".sass", ".less"].some((ext) => source.endsWith(ext)) ||
      source.includes("polyfill")
    );
  }

  isTypeOnlyImport(spec) {
    return spec.importKind === "type";
  }

  // Additional helper methods would be implemented here...
  findHooks(path) {
    return new Set();
  }
  inferPropsType(path) {
    return null;
  }
  hasPropsType(path) {
    return false;
  }
  inferComponentProps(path, context) {
    return [];
  }
  isKnownComponent(name, context) {
    return false;
  }
  suggestComponentOptimizations(path, context) {
    return [];
  }
  addPropsInterface(path, props) {}
}

module.exports = { EnhancedASTEngine };
