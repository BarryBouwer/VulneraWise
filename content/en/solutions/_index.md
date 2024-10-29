---
title: "Solutions"

########### Hero Section ###########
hero_section:
    enable: true
    title: "Our Solutions"
    details: "At VulneraWise, we believe that smart vulnerability management is the key to a secure future."
    button:
        label: "Schedule Demo"
        url: "about-us/#form"
    ########### EV Intelligence Content ###########
    ev_intelligence:
        title: "<span>Exploit & Vulnerability Intelligence</span>"
        subtitle: "Stay Ahead of Cyber Threats with Real-Time Intelligence"
        details: "In an ever-changing threat landscape, timing is everything. VulneraWise delivers real-time updates on the vulnerabilities actively targeted by malicious actors. By integrating data from sources like Exploit Prediction Scoring System (EPSS) and Common Vulnerability Scoring System (CVSS) amongst others and applying our intelligence, our tool provides you with critical insights, allowing your security teams to identify and mitigate threats faster than ever before."
        button:
            label: "Schedule Demo"
            url: "about-us/#form"


########### EV Intelligence Boxes ###########
ev_intelligence_boxes:
    - icon: "images/updates.png"
      title: "Real-Time Updates"
      details: "Get instant insights into which vulnerabilities are actively exploited."
    - icon: "images/decision.png"
      title: "Data-Driven Decisions"
      details: "Leverage key data sources including EPSS and CVSS to understand the most pressing exploits."
    - icon: "images/risk.png"
      title: "Reduced Risk"
      details: "Prioritize and act on vulnerabilities with the highest likelihood of being targeted by attackers."


########### CV Priority ###########
cv_priority:
    enable: true
    title: "<span>Critical Vulnerability Prioritization</span>"
    subtitle: "Remediate What Matters Most"
    details: "Not all vulnerabilities are equal. With VulneraWise, you can identify which vulnerabilities require immediate attention based on both severity and the likelihood of exploitation mapped on your infrastructure. By focusing remediation efforts on high-risk vulnerabilities, we help you optimize your resources and improve your organization’s security posture. "
    button:
        label: "Schedule Demo"
        url: "about-us/#form"
    boxes:
        - icon: "images/turn.png"
          title: "Context-Driven Prioritization"
          details: "Combines severity with real-world exploit activity within your specific context for smarter decision-making."
        - icon: "images/stopwatch.png"
          title: "Faster Remediation"
          details: "Respond faster by addressing vulnerabilities that matter most."
        - icon: "images/id.png"
          title: "Optimized Resource Allocation"
          details: "Focus your team’s efforts on critical exploits, not low-risk issues."
        - icon: "images/select.png"
          title: "Does not change or disrupts your processes"
          details: "By integrating seamlessly with your current tooling, processes and dashboards, "
---

{{< highlight javascript >}}
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
{{< / highlight >}}
