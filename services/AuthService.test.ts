import axios from "axios";
import { AuthService } from "./AuthService";

jest.mock("axios");

describe("AuthService", () => {
    describe("login", () => {
        it("should return user profile and token on successful login", async () => {
            const email = "test@example.com";
            const password = "password";
            const token = "fake-token";
            const profileData = { id: 1, name: "John Doe" };

            (axios.post as jest.Mock).mockResolvedValueOnce({ data: { access_token: token } });
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: profileData });

            const result = await AuthService.login(email, password);

            expect(result).toEqual({ ...profileData, token });
            expect(axios.post).toHaveBeenCalledWith("https://api.escuelajs.co/api/v1/auth/login", { email, password });
            expect(axios.get).toHaveBeenCalledWith("https://api.escuelajs.co/api/v1/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
        });

        it("should throw an error on invalid login", async () => {
            const email = "test@example.com";
            const password = "wrong-password";

            (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid email or password."));

            await expect(AuthService.login(email, password)).rejects.toThrow("Invalid email or password.");
        });
    });

    describe("getProfile", () => {
        it("should return user profile on valid token", async () => {
            const token = "valid-token";
            const profileData = { id: 1, name: "John Doe" };

            (axios.get as jest.Mock).mockResolvedValueOnce({ data: profileData });

            const result = await AuthService.getProfile(token);

            expect(result).toEqual(profileData);
            expect(axios.get).toHaveBeenCalledWith("https://api.escuelajs.co/api/v1/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
        });

        it("should throw an error on invalid token", async () => {
            const token = "invalid-token";

            (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch profile. Please re-login."));

            await expect(AuthService.getProfile(token)).rejects.toThrow("Failed to fetch profile. Please re-login.");
        });
    });
});