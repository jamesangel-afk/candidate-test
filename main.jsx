import { createRoot } from "react-dom/client";
import DocumentDashboard from "./DocumentDashboard";

// Mock the /api/documents endpoint so the component works locally
const mockDocuments = [
    { id: 1, title: "Getting Started Guide" },
    { id: 2, title: "API Reference" },
    { id: 3, title: "Architecture Overview" },
    { id: 4, title: "Deployment Handbook" },
    { id: 5, title: "Testing Best Practices" },
];

const originalFetch = window.fetch;
window.fetch = (url, options) => {
    if (url === "/api/documents") {
        return new Promise(resolve =>
            setTimeout(
                () =>
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(mockDocuments),
                    }),
                500
            )
        );
    }
    return originalFetch(url, options);
};

createRoot(document.getElementById("root")).render(<DocumentDashboard />);
