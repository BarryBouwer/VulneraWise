const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "https://api.vulnerawise.ai/v1/vuln?description=kubernetes";
const TOP10_API_URL = "https://trend.vulnerawise.ai/top10.json";

const outputDir = path.join(__dirname, "content", "en", "cves");
const jsonOutputDir = path.join(__dirname, "assets", "data");
const jsonOutputPath = path.join(jsonOutputDir, "vulnerabilities.json");
const top10OutputPath = path.join(jsonOutputDir, "top10.json");

// 🗑️ Function to delete existing files in the directory
const clearDirectory = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
    console.log("🗑️ Deleted all existing markdown files in:", dir);
  }
};

// 💾 Function to save JSON data to a file
const saveJSONToFile = (filePath, data) => {
  if (!fs.existsSync(jsonOutputDir)) {
    fs.mkdirSync(jsonOutputDir, { recursive: true });
  }

  fs.writeFileSync(filePath, "", "utf-8");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`💾 JSON data saved to ${filePath}`);
};

// 🔁 Fetch and save Top10 Trends
const fetchAndSaveTop10 = async () => {
  try {
    const response = await axios.get(TOP10_API_URL);
    saveJSONToFile(top10OutputPath, response.data);
  } catch (error) {
    console.error("❌ Error fetching Top 10 data:", error.message);
  }
};

// Fetch CVE data and write Markdown + JSON
axios
  .get(API_URL)
  .then(async (response) => {
    console.log("Raw API Response:", response.data); // Debugging

    const cveData = response.data.data;

    // 💾 Save the raw JSON response
    saveJSONToFile(jsonOutputPath, response.data);

    if (!Array.isArray(cveData)) {
      console.error("Error: Expected an array but got:", typeof cveData);
      return;
    }

    // 🗑️ Clear existing markdown files
    clearDirectory(outputDir);

    const formatDate = (dateString) => {
      return new Date(dateString).toISOString().split("T")[0];
    };

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    cveData.forEach((item) => {
      const cve = item.cve;

      if (!cve || !cve.id) {
        console.warn("Skipping invalid CVE entry:", item);
        return;
      }

      const markdownContent = `---
title: "${cve.id}"
date: "${cve.metadata?.published_date || ""}"
last_modified: "${cve.metadata?.last_modified_date || ""}"
---

Date: **${formatDate(cve.metadata?.published_date)}** Last Modified: **${formatDate(cve.metadata?.last_modified_date)}**

### Description  
${cve.description}

### Metadata  
- **Severity:** ${cve.metadata?.severity || "unknown"}
- **Confidence Level:** ${cve.metadata?.confidence_level || "unknown"}

### Impact  
- **CISA KEV:** ${cve.impact?.cisa_kev ? "Yes" : "No"}
- **Known Ransomware Use:** ${cve.impact?.known_ransomware_campaign_use ? "Yes" : "No"}
- **Weaponized:** ${cve.impact?.weaponized ? "Yes" : "No"}
- **Reported Exploited:** ${cve.impact?.reported_exploited ? "Yes" : "No"}
- **Exploit Maturity:** ${cve.impact?.exploit_maturity || "unknown"}
- **Automatable:** ${cve.impact?.automatable ? "Yes" : "No"}

### CVSS Metrics  
${
  cve.metrics
    ?.map(
      (metric, index) => `
#### Metric ${index + 1}
- **Source:** ${metric.source}
- **Type:** ${metric.type}
- **CVSS Version:** ${metric.cvss_version}
- **Vector String:** ${metric.vector_string}
- **Attack Vector:** ${metric.attack_vector}
- **Base Score:** ${metric.base_score}
`
    )
    .join("") || "No CVSS data available"
}

### EPSS (Exploit Prediction Scoring System)  
- **Score:** ${cve.epss?.score || "unknown"}
- **Percentile:** ${cve.epss?.percentile || "unknown"}

### Other Details  
- **Public Exploit Count:** ${cve.counts?.public_exploit_count || 0}
`;

      const filePath = path.join(outputDir, `${cve.id}.md`);
      fs.writeFileSync(filePath, markdownContent);
      console.log(`✅ Created: ${filePath}`);
    });

    console.log("🎉 All CVE Markdown files have been generated successfully.");

    // 🔁 Fetch and save Top 10 as well
    await fetchAndSaveTop10();
  })
  .catch((error) => {
    console.error("❌ Error fetching CVE data:", error.message);
  });