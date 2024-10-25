---
title: Vulnerawize API Documentation 
weight: 1
---

## Overview

The Vulnerawize API provides comprehensive information about software vulnerabilities, helping organizations prioritize vulnerability management. The API leverages the Vulnerawize Decision Trees framework to provide decisions based on exploitation, automation, exposure, and impact.

## Base URL


https://api.vulnerawize.ai

## Endpoint

### Get Vulnerability Information

**Endpoint:** `/v1/vuln`

**Method:** `GET`

**Description:** Retrieves detailed vulnerability information based on provided CVE IDs. Supports querying multiple CVE IDs at once, with a limit of 200.

### Query Parameters

- `vulnIds` (required): Comma-separated list of vulnerability IDs (e.g., `CVE-2021-44228,CVE-2021-45046`). Limit: 200.
- `exposure` (optional): Exposure level (`open`, `small`, `controlled`). Default: `open`.
- `impact` (optional): Impact level (`low`, `medium`, `high`, `critical`). Default: `high`.

### Example Request

**Request:**

```bash
GET /v1/vuln?vulnIds=CVE-2021-44228,CVE-2021-45046&exposure=small&impact=medium
```

### Curl Example

```sh
curl -X GET "https://api.vulnerawize.ai/v1/vuln?vulnIds=CVE-2021-44228,CVE-2021-45046&exposure=open&impact=medium"
```

### Python Example

```python
import requests

url = "https://api.vulnerawize.ai/v1/vuln"
params = {
    "vulnIds": "CVE-2021-44228,CVE-2021-45046",
    "exposure": "small",
    "impact": "medium"
}

response = requests.get(url, params=params)
print(response.json())
```

### Go Example

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    baseURL := "https://api.vulnerawize.ai/v1/vuln"
    params := url.Values{}
    params.Add("vulnIds", "CVE-2021-44228,CVE-2021-45046")
    params.Add("exposure", "small")
    params.Add("impact", "medium")

    queryURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())
    resp, err := http.Get(queryURL)
    if err != nil {
        log.Fatalf("Failed to make request: %v", err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        log.Fatalf("Failed to parse response: %v", err)
    }

    resultJSON, err := json.MarshalIndent(result, "", "  ")
    if err != nil {
        log.Fatalf("Failed to marshal response: %v", err)
    }

    fmt.Println(string(resultJSON))
}
```

## Response Structure

The response from the API includes metadata about the request and an array of vulnerability data.

### Response Example

```json
{
  "metadata": {
    "timestamp": "2024-06-14T12:02:22.341011+00:00"
  },
  "data": [
    {
      "id": "CVE-2021-44228",
      "severity": "critical",
      "automatable": "yes",
      "cisaKEV": true,
      "reported_exploited": true,
      "exploit_maturity": "active",
      "counts": {
        "public_exploit_count": 410
      },
      "timeline": {
        "nvd_published": "2021-12-10",
        "cisaKEV_published": "2021-12-10"
      },
      "epss": {
        "epss_score": "0.97547",
        "epss_percentile": "0.99996"
      },
      "ssvc": {
        "automatable": "yes",
        "exposure": "open",
        "impact": "high",
        "decision": "immediate"
      },
      "exploits": [
        {
          "url": "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
          "name": "Apache Log4j2 Remote Code Execution Vulnerability",
          "source": "cisa_kev",
          "date_added": "2021-12-10",
          "exploit_maturity": "in_wild"
        },
        {
          "url": "https://gitlab.com/exploit-database/exploitdb/-/blob/main/exploits/java/remote/51183.txt",
          "name": "AD Manager Plus 7122 - Remote Code Execution (RCE)",
          "source": "exploitdb",
          "date_added": "2023-04-01",
          "exploit_maturity": "poc"
        },
        {
          "url": "https://gitlab.com/exploit-database/exploitdb/-/blob/main/exploits/java/remote/50592.py",
          "name": "Apache Log4j 2 - Remote Code Execution (RCE)",
          "source": "exploitdb",
          "date_added": "2021-12-14",
          "exploit_maturity": "poc"
        },
        ...
        ...
        ...
      ]
    }
  ]
}
```

## Rate Limiting

The API enforces a rate limit to ensure fair usage for all clients.

- **Rate Limit**: 30 requests per minute

If the rate limit is exceeded, the API will return a `429 Too Many Requests` status code. Clients are advised to implement retry logic with exponential backoff to handle rate limiting gracefully.

## Decision Trees

The Vulnerawize Decision Trees framework helps in making informed decisions by considering multiple factors:

- **Exploitation**: Whether the vulnerability is actively being exploited.
- **Automation**: Whether the exploitation of the vulnerability can be automated.
- **Exposure**: The level of exposure of the system to the vulnerability.
- **Impact**: The potential impact on the system or business.

### Decision Example

```json
{
  "ssvc": {
    "automatable": true,
    "exposure": "small",
    "impact": "medium",
    "decision": "immediate"
  }
}
```

## Product Overview

The Vulnerawize API provides exploit and vulnerability intelligence directly into the tools, processes, programs, and systems that need it to outpace adversaries. By integrating this API, organizations can prioritize vulnerabilities that matter based on the threat landscape and defer those that don't, using the Vulnerawize Decision Trees framework.

### Key Benefits

- **Vulnerability Prioritization**: Focus on vulnerabilities that pose the highest risk based on current threats and defer those with lower impact.
- **Automation and Integration**: Seamlessly integrate with existing tools and processes to streamline vulnerability management.
- **Comprehensive Insights**: Gain detailed information about vulnerabilities, including exploit availability and impact assessments.

## Conclusion

The Vulnerawize API provides crucial information for prioritizing vulnerability management within organizations. By incorporating the Vulnerawize Decision Trees framework, it offers a structured approach to making decisions based on exploitation, automation, exposure, and human impact.