import { FriendOptionsMenu } from "../components/FriendsOptionsMenu.jsx";
import { beforeEach, describe, expect, test, vi } from "vitest";
import api from "../api";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { data, MemoryRouter, useNavigate } from "react-router";



const mockNavigate = vi.fn();


vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
  ...actual, 
  useNavigate: () => mockNavigate,
  };
});


global.alert = vi.fn();
global.confirm = vi.fn();
global.window = Object.create(window);
global.window.location = { reload: vi.fn() }


vi.mock("../api", () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn()
  }
}));


describe("OptionMenu", () => {
  const friend = {
    _id: "helloworld",
    connectionId: "helloworld"
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // RoomChat button test
  test("Room", async () => {
   api.post.mockResolvedValue({
      data: { _id: "room123" }
    });
    render(
      <MemoryRouter>
        <FriendOptionsMenu friend={friend} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("rooms", {
        name: "New Room Chat",
        participants: ["helloworld"],
        type: "DIRECT",
      });

      expect(mockNavigate).toHaveBeenCalledWith("/rooms/room123");});
  });




  // Profile button test
  test("profileButton", () => {
    render(
      <MemoryRouter>
        <FriendOptionsMenu friend={friend} />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /view profile/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/profiles/helloworld");
  });

  // Delete Friend
  test("Delete Friend", async () => {
    global.confirm.mockReturnValue(true);

    api.delete.mockResolvedValue({});

    render(
      <MemoryRouter>
        <FriendOptionsMenu friend={friend} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /delete friend/i }));

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalledWith(
        "Do you want to delete this user from your friends list?"
      );

      expect(api.delete).toHaveBeenCalledWith("/connection/helloworld");
      expect(alert).toHaveBeenCalledWith("Friend Deleted");
      expect(window.location.reload).toHaveBeenCalledWith();
    });
  });

  // Delete Friend (if click no)
  test("Delete Friend if click cancel", async () => {
    global.confirm.mockReturnValue(false);

    render(
      <MemoryRouter>
        <FriendOptionsMenu friend={friend} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /delete friend/i }));

      expect(api.delete).not.toHaveBeenCalledWith();
      expect(alert).not.toHaveBeenCalledWith();
      expect(window.location.reload).not.toHaveBeenCalledWith();
      expect(mockNavigate).not.toHaveBeenCalledWith();
    });

});


