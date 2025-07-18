"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResults = formatResults;
const chalk_1 = __importDefault(require("chalk"));
function formatResults(results, format) {
    switch (format) {
        case "json":
            console.log(JSON.stringify(results, null, 2));
            break;
        case "summary":
            formatSummary(results);
            break;
        case "table":
        default:
            formatTable(results);
            break;
    }
}
function formatTable(results) {
    console.log(chalk_1.default.white("\nAnalysis Results:\n"));
    results.forEach((result, index) => {
        const status = result.success ? chalk_1.default.white("PASS") : chalk_1.default.white("FAIL");
        console.log(`${status} ${result.file}`);
        if (result.success && result.layers) {
            result.layers.forEach((layer) => {
                const layerStatus = layer.status === "success" ? chalk_1.default.white("PASS") : chalk_1.default.gray("SKIP");
                const changes = layer.changes || 0;
                console.log(`   ${layerStatus} Layer ${layer.id}: ${layer.name} ${changes > 0 ? chalk_1.default.gray(`(${changes} changes)`) : ""}`);
                if (layer.insights && layer.insights.length > 0) {
                    layer.insights.forEach((insight) => {
                        const severity = chalk_1.default.gray("•");
                        console.log(`     ${severity} ${insight.message}`);
                    });
                }
            });
        }
        else if (!result.success) {
            console.log(`     ${chalk_1.default.white("ERROR:")} ${result.error}`);
        }
        if (index < results.length - 1) {
            console.log("");
        }
    });
}
function formatSummary(results) {
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    console.log(chalk_1.default.white("\nAnalysis Summary\n"));
    console.log(chalk_1.default.white(`Files processed: ${results.length}`));
    console.log(chalk_1.default.white(`Successful: ${successful.length}`));
    if (failed.length > 0) {
        console.log(chalk_1.default.white(`Failed: ${failed.length}`));
    }
    if (successful.length > 0) {
        // Calculate layer statistics
        const layerStats = {};
        let totalIssues = 0;
        successful.forEach((result) => {
            if (result.layers) {
                result.layers.forEach((layer) => {
                    if (!layerStats[layer.id]) {
                        layerStats[layer.id] = {
                            name: layer.name,
                            files: 0,
                            changes: 0,
                            issues: 0,
                        };
                    }
                    layerStats[layer.id].files++;
                    layerStats[layer.id].changes += layer.changes || 0;
                    if (layer.insights) {
                        layerStats[layer.id].issues += layer.insights.length;
                        totalIssues += layer.insights.length;
                    }
                });
            }
        });
        console.log(chalk_1.default.white(`Total issues found: ${totalIssues}`));
        console.log(chalk_1.default.white("\nLayer Performance:"));
        Object.entries(layerStats).forEach(([layerId, stats]) => {
            console.log(chalk_1.default.white(`Layer ${layerId} (${stats.name}):`));
            console.log(chalk_1.default.gray(`  Files: ${stats.files}, Changes: ${stats.changes}, Issues: ${stats.issues}`));
        });
    }
}
