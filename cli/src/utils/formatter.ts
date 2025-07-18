import chalk from "chalk";

export function formatResults(results: any[], format: string) {
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

function formatTable(results: any[]) {
  console.log(chalk.white("\nAnalysis Results:\n"));

  results.forEach((result, index) => {
    const status = result.success ? chalk.white("PASS") : chalk.white("FAIL");
    console.log(`${status} ${result.file}`);

    if (result.success && result.layers) {
      result.layers.forEach((layer: any) => {
        const layerStatus =
          layer.status === "success" ? chalk.white("PASS") : chalk.gray("SKIP");
        const changes = layer.changes || 0;
        console.log(
          `   ${layerStatus} Layer ${layer.id}: ${layer.name} ${changes > 0 ? chalk.gray(`(${changes} changes)`) : ""}`,
        );

        if (layer.insights && layer.insights.length > 0) {
          layer.insights.forEach((insight: any) => {
            const severity = chalk.gray("•");
            console.log(`     ${severity} ${insight.message}`);
          });
        }
      });
    } else if (!result.success) {
      console.log(`     ${chalk.white("ERROR:")} ${result.error}`);
    }

    if (index < results.length - 1) {
      console.log("");
    }
  });
}

function formatSummary(results: any[]) {
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(chalk.white("\nAnalysis Summary\n"));
  console.log(chalk.white(`Files processed: ${results.length}`));
  console.log(chalk.white(`Successful: ${successful.length}`));
  if (failed.length > 0) {
    console.log(chalk.white(`Failed: ${failed.length}`));
  }

  if (successful.length > 0) {
    // Calculate layer statistics
    const layerStats: Record<
      string,
      { name: string; files: number; changes: number; issues: number }
    > = {};
    let totalIssues = 0;

    successful.forEach((result: any) => {
      if (result.layers) {
        result.layers.forEach((layer: any) => {
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

    console.log(chalk.white(`Total issues found: ${totalIssues}`));

    console.log(chalk.white("\nLayer Performance:"));
    Object.entries(layerStats).forEach(([layerId, stats]: [string, any]) => {
      console.log(chalk.white(`Layer ${layerId} (${stats.name}):`));
      console.log(
        chalk.gray(
          `  Files: ${stats.files}, Changes: ${stats.changes}, Issues: ${stats.issues}`,
        ),
      );
    });
  }
}
