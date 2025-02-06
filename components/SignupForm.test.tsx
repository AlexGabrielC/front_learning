import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "./SignupForm";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";

jest.mock("@/services/UserService");
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("SignupForm", () => {
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
        jest.clearAllMocks();
    });

    it("renders the signup form", () => {
        render(<SignupForm />);
        expect(screen.getByText("Inscription")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("m@example.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("https://api.lorem.space/image/face?w=640&h=480")).toBeInTheDocument();
    });

    it("checks email availability on blur", async () => {
        (UserService.checkEmailAvailability as jest.Mock).mockResolvedValue(false);
        render(<SignupForm />);
        const emailInput = screen.getByPlaceholderText("m@example.com");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.blur(emailInput);
        await waitFor(() => expect(UserService.checkEmailAvailability).toHaveBeenCalledWith("test@example.com"));
    });

    it("shows error if email is already used", async () => {
        (UserService.checkEmailAvailability as jest.Mock).mockResolvedValue(true);
        render(<SignupForm />);
        const emailInput = screen.getByPlaceholderText("m@example.com");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.blur(emailInput);
        await waitFor(() => expect(screen.getByText("This email is already used")).toBeInTheDocument());
    });

    it("handles signup successfully", async () => {
        (UserService.checkEmailAvailability as jest.Mock).mockResolvedValue(false);
        (UserService.createUser as jest.Mock).mockResolvedValue(true);
        render(<SignupForm />);
        fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("m@example.com"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password" } });
        fireEvent.change(screen.getByPlaceholderText("https://api.lorem.space/image/face?w=640&h=480"), { target: { value: "https://example.com/avatar.jpg" } });
        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));
        await waitFor(() => expect(UserService.createUser).toHaveBeenCalledWith({
            name: "John Doe",
            email: "test@example.com",
            password: "password",
            avatar: "https://example.com/avatar.jpg",
        }));
        await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/login"));
    });

    it("shows error if signup fails", async () => {
        (UserService.checkEmailAvailability as jest.Mock).mockResolvedValue(false);
        (UserService.createUser as jest.Mock).mockRejectedValue(new Error("Signup failed"));
        render(<SignupForm />);
        fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("m@example.com"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password" } });
        fireEvent.change(screen.getByPlaceholderText("https://api.lorem.space/image/face?w=640&h=480"), { target: { value: "https://example.com/avatar.jpg" } });
        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));
        await waitFor(() => expect(screen.getByText("Signup failed. Please try again.")).toBeInTheDocument());
    });
});