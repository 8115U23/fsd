import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/main-layout";
import { HomePage } from "./pages/home";
import { PlannerPage } from "./pages/planner";
import { GoalsPage } from "./pages/goals";
import { WellnessPage } from "./pages/wellness";
import { VoiceAssistantPage } from "./pages/voice-assistant";
import { AnalyticsPage } from "./pages/analytics";
import { RoutinesPage } from "./pages/routines";
import { CollaborationPage } from "./pages/collaboration";
import { ShoppingPage } from "./pages/shopping";
import { CommunicationPage } from "./pages/communication";
import { DocumentsPage } from "./pages/documents";
import { SmartDevicesPage } from "./pages/smart-devices";
import { FocusModePage } from "./pages/focus-mode";
import { DashboardEditorPage } from "./pages/dashboard-editor";
import { NotificationsPage } from "./pages/notifications";
import { EmergencyPage } from "./pages/emergency";
import { ProfilePage } from "./pages/profile";
import { DesignSystemPage } from "./pages/design-system";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "planner", Component: PlannerPage },
      { path: "goals", Component: GoalsPage },
      { path: "wellness", Component: WellnessPage },
      { path: "voice", Component: VoiceAssistantPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "routines", Component: RoutinesPage },
      { path: "collaboration", Component: CollaborationPage },
      { path: "shopping", Component: ShoppingPage },
      { path: "communication", Component: CommunicationPage },
      { path: "documents", Component: DocumentsPage },
      { path: "devices", Component: SmartDevicesPage },
      { path: "focus", Component: FocusModePage },
      { path: "editor", Component: DashboardEditorPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "emergency", Component: EmergencyPage },
      { path: "profile", Component: ProfilePage },
      { path: "design-system", Component: DesignSystemPage },
    ],
  },
]);
