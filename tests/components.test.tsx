import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AikoSensei from "@/components/AikoSensei";
import TopicIllustration from "@/components/TopicIllustration";

describe("Aiko Sensei + illustrations (original SVG art)", () => {
  it("renders Aiko in all three moods as SVG", () => {
    for (const mood of ["normal", "happy", "thinking"] as const) {
      const { container, unmount } = render(<AikoSensei mood={mood} />);
      expect(container.querySelector("svg")).not.toBeNull();
      expect(screen.getByLabelText(new RegExp(`Aiko Sensei \\(${mood}\\)`))).toBeTruthy();
      unmount();
    }
  });
  it("renders a topic illustration SVG with no external images", () => {
    const { container } = render(<TopicIllustration kind="kubernetes" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });
});
