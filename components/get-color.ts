import { HabitProps } from "@/lib/types";

interface Color {
  card: string; // background color of the card
  text: string; // text color for the description
  icon: {
    background: string; // background color of the icon
    color: string; // text color of the icon
  };
  log: {
    pending: string; // background color of the log when the habit is not done
    done: string; // background color of the log when the habit is done
  };
}

interface ColorScheme {
  light: Color;
  dark: Color;
}

export const getColor: Record<HabitProps["color"], ColorScheme> = {
  blue: {
    light: {
      card: "#f0f9ff", // cooler light blue
      text: "#1e3a8a",
      icon: {
        background: "#93c5fd", // blue-300
        color: "#1e3a8a",
      },
      log: {
        pending: "#e0f2fe", // blue-100
        done: "#2563eb", // blue-600
      },
    },
    dark: {
      card: "#1a2234",
      text: "#93c5fd",
      icon: {
        background: "#1e3a8a",
        color: "#93c5fd",
      },
      log: {
        pending: "#23293b",
        done: "#3b82f6",
      },
    },
  },
  red: {
    light: {
      card: "#fef2f2", // slightly whiter
      text: "#991b1b",
      icon: {
        background: "#fca5a5", // red-300
        color: "#991b1b",
      },
      log: {
        pending: "#fee2e2", // red-100
        done: "#dc2626", // red-600
      },
    },
    dark: {
      card: "#2c1a1a",
      text: "#fca5a5",
      icon: {
        background: "#7f1d1d",
        color: "#fca5a5",
      },
      log: {
        pending: "#3b2323",
        done: "#ef4444",
      },
    },
  },
  pink: {
    light: {
      card: "#fdf2f8",
      text: "#9d174d",
      icon: {
        background: "#f9a8d4", // pink-300
        color: "#9d174d",
      },
      log: {
        pending: "#fce7f3", // pink-100
        done: "#db2777", // pink-600
      },
    },
    dark: {
      card: "#2c1a23",
      text: "#f9a8d4",
      icon: {
        background: "#be185d",
        color: "#f9a8d4",
      },
      log: {
        pending: "#3b2330",
        done: "#ec4899",
      },
    },
  },
  orange: {
    light: {
      card: "#fff7ed",
      text: "#9a3412",
      icon: {
        background: "#fdba74",
        color: "#9a3412",
      },
      log: {
        pending: "#ffedd5", // orange-100
        done: "#ea580c", // orange-600
      },
    },
    dark: {
      card: "#2c231a",
      text: "#fdba74",
      icon: {
        background: "#ea580c",
        color: "#fdba74",
      },
      log: {
        pending: "#3b2e23",
        done: "#f59e42",
      },
    },
  },
  yellow: {
    light: {
      card: "#fefce8",
      text: "#854d0e",
      icon: {
        background: "#fde047", // yellow-300
        color: "#854d0e",
      },
      log: {
        pending: "#fef9c3", // yellow-100 — very pale
        done: "#eab308", // yellow-600 — deeper than pending
      },
    },
    dark: {
      card: "#2c261a",
      text: "#fde68a",
      icon: {
        background: "#b45309",
        color: "#fde68a",
      },
      log: {
        pending: "#3b3523",
        done: "#facc15",
      },
    },
  },
  green: {
    light: {
      card: "#ecfdf5", // pale mint
      text: "#065f46",
      icon: {
        background: "#6ee7b7", // green-300
        color: "#065f46",
      },
      log: {
        pending: "#d1fae5", // green-100
        done: "#059669", // green-600
      },
    },
    dark: {
      card: "#182c1e",
      text: "#6ee7b7",
      icon: {
        background: "#134e2f",
        color: "#6ee7b7",
      },
      log: {
        pending: "#22332b",
        done: "#22c55e",
      },
    },
  },
  purple: {
    light: {
      card: "#f5f3ff",
      text: "#5b21b6",
      icon: {
        background: "#c4b5fd", // purple-300
        color: "#5b21b6",
      },
      log: {
        pending: "#ede9fe",
        done: "#8b5cf6",
      },
    },
    dark: {
      card: "#231a2c",
      text: "#c4b5fd",
      icon: {
        background: "#6d28d9",
        color: "#c4b5fd",
      },
      log: {
        pending: "#2e2340",
        done: "#a78bfa",
      },
    },
  },
};
