import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { ROUTES } from "../constants/routes";
import { HomePage } from "../pages/HomePage";
import { LibraryPage } from "../pages/LibraryPage";
import { LoginCallbackPage } from "../pages/LoginCallbackPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OverlayDetailPage } from "../pages/OverlayDetailPage";
import { OverlayEditorPage } from "../pages/OverlayEditorPage";
import { OverlayListPage } from "../pages/OverlayListPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.overlays,
        element: <OverlayListPage />,
      },
      {
        path: ROUTES.overlayDetail,
        element: <OverlayDetailPage />,
      },
      {
        path: ROUTES.editor,
        element: (
          <ProtectedRoute>
            <OverlayEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.editorClone,
        element: (
          <ProtectedRoute>
            <OverlayEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.library,
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.loginCallback,
        element: <LoginCallbackPage />,
      },
      {
        path: ROUTES.notFound,
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
