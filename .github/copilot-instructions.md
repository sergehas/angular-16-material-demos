# Copilot Instructions (GCM GUI)

- For all questions related to angular use : [@agents/angular_tech_lead]: .github/agents/angular.agent.md
- For all questions related to css use : [@agents/css_expert]: .github/agents/css.agent.md

# Change Detection Strategy

Use `ChangeDetectionStrategy.OnPush` for all new components to optimize performance by reducing unnecessary change detection cycles. This is a critical best practice in Angular development that can significantly improve the responsiveness of the application, especially as it scales.
