/**
 * DocumentDashboard Test Suite
 *
 * These tests verify correct behaviour of the DocumentDashboard component.
 * They currently FAIL because the component has bugs.
 *
 * Your task: fix the bugs in DocumentDashboard.jsx until all tests pass.
 *
 * Run:  npm install && npm test
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import DocumentDashboard from "./DocumentDashboard";

const mockDocuments = [
    { id: 1, title: "Getting Started Guide" },
    { id: 2, title: "API Reference" },
    { id: 3, title: "Architecture Overview" },
];

function mockFetch(data = mockDocuments) {
    return vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(data),
        })
    );
}

describe("DocumentDashboard", () => {
    beforeEach(() => {
        global.fetch = mockFetch();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders without crashing", () => {
        render(<DocumentDashboard />);
        expect(screen.getByText("Document Dashboard")).toBeInTheDocument();
    });

    it("shows a loading indicator while fetching documents", async () => {
        let resolveFetch;
        global.fetch = vi.fn(
            () =>
                new Promise(resolve => {
                    resolveFetch = resolve;
                })
        );

        render(<DocumentDashboard />);
        expect(screen.getByText("Loading documents…")).toBeInTheDocument();

        resolveFetch({ json: () => Promise.resolve(mockDocuments) });

        await waitFor(() => {
            expect(screen.queryByText("Loading documents…")).not.toBeInTheDocument();
        });
    });

    it("renders all fetched documents", async () => {
        render(<DocumentDashboard />);

        await waitFor(() => {
            mockDocuments.forEach(doc => {
                expect(screen.getByText(doc.title)).toBeInTheDocument();
            });
        });
    });

    it("filters documents based on search input (with debounce)", async () => {
        const user = userEvent.setup();
        render(<DocumentDashboard />);

        await waitFor(() => {
            expect(screen.getByText("Getting Started Guide")).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText("Search documents…");
        await user.type(input, "api");

        await waitFor(() => {
            expect(screen.getByText("API Reference")).toBeInTheDocument();
            expect(screen.queryByText("Getting Started Guide")).not.toBeInTheDocument();
            expect(screen.queryByText("Architecture Overview")).not.toBeInTheDocument();
        });
    });

    it("clear search button resets the search and shows all documents", async () => {
        const user = userEvent.setup();
        render(<DocumentDashboard />);

        await waitFor(() => {
            expect(screen.getByText("Getting Started Guide")).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText("Search documents…");
        await user.type(input, "api");

        await waitFor(() => {
            expect(screen.queryByText("Getting Started Guide")).not.toBeInTheDocument();
        });

        await user.click(screen.getByText("Clear Search"));

        await waitFor(() => {
            mockDocuments.forEach(doc => {
                expect(screen.getByText(doc.title)).toBeInTheDocument();
            });
        });
    });

    it("renders list items with unique keys (no console warnings)", async () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        render(<DocumentDashboard />);

        await waitFor(() => {
            expect(screen.getByText("Getting Started Guide")).toBeInTheDocument();
        });

        const keyWarning = consoleError.mock.calls.find(call =>
            call.some(arg => typeof arg === "string" && arg.includes("unique"))
        );

        expect(keyWarning).toBeUndefined();
        consoleError.mockRestore();
    });
});
