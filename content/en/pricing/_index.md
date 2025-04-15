---
title: Pricing

########### Hero Section ###########
hero_section:
    enable: true
    title: "<span>Pricing</span>"
    subtitle: Choose the Plan that Fits Your Needs
    details: At VulneraWise, we offer flexible subscriptions to fit organizations of all sizes and security requirements. Whether you're just starting out or need a fully customizable solution, we’ve got you covered.

########### Tabs Section ###########
tabs:
    enable: true
    monthly_billing:
        - plan_name: "Free Plan"
          price: 0
          description: Get started with powerful vulnerability search and basic prioritization tools—for individuals or small teams exploring what matters most.
          features:
            - Advanced search with basic filters
            - Up to 5 uploads/day (after sign-in)
            - Included per vulnerability based in standard prioritization flow
            - Not available
            - Standard template access, no editor
            - Not available
            - Manual export only (CSV, JSON)
            - Not available
            - Customer support with 24hr response time
        - plan_name: "Professional plan"
          popular: true
          price: 10
          description: Scale your workflow with API access, automation features, and advanced analytics—built for growing teams and security professionals. It includes Everything of the Free tier and much more.
          features:
            - With enhanced filters & real-time updates
            - Up to 100 uploads/day
            - Full access with enriched context
            - Included (1M - 5M requests/mo, pay-as-you-grow)
            - Custom flow builder
            - Yes
            - Slack, Teams, PowerBI, Grafana
            - SSO support
            - Priority email support
        - plan_name: "Enterprise Plan"
          price: 30
          description: Unlock full flexibility with unlimited access, on-prem CLI, advanced security, and deep integration across your entire workflow.
          features:
            - All features, priority access
            - Unlimited (incl. batch uploads)
            - Fully customizable
            - Unlimited with custom SLA
            - Full editor + versioning & team collaboration
            - Yes
            - API & CLI, pipeline integration-ready
            - SSO, SCIM, compliance-ready
            - Dedicated SPOC and custom SLA

    annual_billing:
        - plan_name: "Free Plan"
          price: Free
          access: "Full access to our vulnerability catalogues, insights, and usage of the API with a limited number of API calls."
          perfect_for: "Small teams or individual users exploring comprehensive vulnerability insights and basic API functionality."
          button: 
            label: "Get started"
            url: "docs/"
        - plan_name: "Professional plan"
          coming_soon: true
          popular: true
          price: Free during Beta
          access: "Everything of the Free tier, including an expanded # of API calls and the use of our decision tree for prioritized threat intelligence."
          includes: "Access to real-time exploit intelligence and vulnerability prioritization with up to 200.000 API calls per month"
          perfect_for: "Teams needing deeper integration and prioritized guidance on vulnerabilities most relevant to their business."
          button: 
            label: "Details"
            url: "pricing/"
        - plan_name: "Enterprise Plan"
          coming_soon: true
          price: Contact us
          access: "Includes everything in the Professional Plan, with unlimited API calls, customizable decision trees, and the option to host VulneraWise within your IT environment."
          includes: "Advanced analytics and insights, unlimited API usage, and access to customizable decision trees to create context specific algorithms for your business."
          perfect_for: "Organizations looking to scale and require extensive integration with their existing systems."
          button: 
            label: "Contact us"
            url: "about-us/#form"
---
