export const calculator = {
  form: {
    title: "TikTok Earnings Calculator",
    description: "Enter your TikTok metrics to get an accurate estimate of your potential earnings from various monetization methods."
  },
  stats: {
    users: "Users",
    accuracy: "Accuracy",
    calculations: "Calculations"
  },
  platforms: {
    tiktok: {
      badge: "TikTok Badge"
    },
    instagram: {
      badge: "Instagram Badge"
    },
    youtube: {
      badge: "YouTube Badge"
    }
  },
  tiktok: {
    sections: {
      basic: {
        title: "Basic Information",
        description: "Enter your basic TikTok account details."
      },
      profile: {
        title: "Profile Information",
        description: "Help us provide more accurate estimates"
      },
      advanced: {
        title: "Advanced Settings",
        description: "Configure advanced options for more precise results."
      }
    },
    fields: {
      followers: {
        label: "Followers"
      },
      avgViews: {
        label: "Average Views per Video"
      },
      avgLikes: {
        label: "Average Likes per Video"
      },
      avgComments: {
        label: "Average Comments per Video"
      },
      contentNiche: {
        label: "Content Niche",
        placeholder: "Select your content niche"
      },
      audienceLocation: {
        label: "Audience Location",
        placeholder: "Select your audience location"
      }
    },
    engagement: {
      title: "Engagement Rate",
      good: "Good engagement"
    },
    actions: {
      showAdvanced: "Show Advanced",
      calculate: "Calculate"
    },
    tips: {
      accuracy: "Higher accuracy with more data."
    }
  },
  instagram: {
    sections: {
      basic: {
        title: "Basic Information",
        description: "Enter your basic Instagram account details."
      },
      profile: {
        title: "Profile Information",
        description: "Help us provide more accurate estimates"
      },
      advanced: {
        title: "Advanced Settings",
        description: "Configure advanced options for more precise results."
      }
    },
    fields: {
      followers: {
        label: "Followers"
      },
      avgLikes: {
        label: "Average Likes per Post"
      },
      avgComments: {
        label: "Average Comments per Post"
      },
      avgReelsViews: {
        label: "Average Reels Views"
      },
      contentNiche: {
        label: "Content Niche",
        placeholder: "Select your content niche"
      },
      audienceLocation: {
        label: "Audience Location",
        placeholder: "Select your audience location"
      }
    },
    engagement: {
      title: "Engagement Rate",
      excellent: "Excellent engagement"
    },
    actions: {
      showAdvanced: "Show Advanced",
      calculate: "Calculate"
    },
    tips: {
      accuracy: "Higher accuracy with more data."
    }
  },
  youtube: {
    sections: {
      basic: {
        title: "Basic Information",
        description: "Enter your basic YouTube channel details."
      },
      profile: {
        title: "Profile Information",
        description: "Help us provide more accurate estimates"
      },
      advanced: {
        title: "Advanced Settings",
        description: "Configure advanced options for more precise results."
      }
    },
    fields: {
      subscribers: {
        label: "Subscribers"
      },
      avgViews: {
        label: "Average Views per Video"
      },
      avgLikes: {
        label: "Average Likes per Video"
      },
      avgComments: {
        label: "Average Comments per Video"
      },
      avgWatchTime: {
        label: "Average Watch Time (minutes)"
      },
      videoLength: {
        label: "Average Video Length (minutes)"
      },
      contentNiche: {
        label: "Content Niche",
        placeholder: "Select your content niche"
      },
      audienceLocation: {
        label: "Audience Location",
        placeholder: "Select your audience location"
      }
    },
    engagement: {
      title: "Engagement Rate",
      good: "Good engagement"
    },
    watchTime: {
      title: "Watch Time",
      average: "Average watch time"
    },
    actions: {
      showAdvanced: "Show Advanced",
      calculate: "Calculate"
    },
    tips: {
      accuracy: "Higher accuracy with more data."
    }
  },
  history: {
    title: "Calculation History",
    description: "View your previous calculations and results.",
    empty: "No calculation history found."
  }
} as const;