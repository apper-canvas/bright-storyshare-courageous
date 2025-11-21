import React from "react"

const Loading = ({ type = "page" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg shadow-card p-6 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-md mb-4 shimmer"></div>
            <div className="h-6 bg-gray-200 rounded mb-3 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-16 bg-gray-200 rounded-full shimmer"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full shimmer"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 w-16 bg-gray-200 rounded shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "chapter") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded mx-auto mb-4 shimmer" style={{width: "60%"}}></div>
          <div className="h-4 bg-gray-200 rounded mx-auto shimmer" style={{width: "40%"}}></div>
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded shimmer" style={{width: "95%"}}></div>
              <div className="h-4 bg-gray-200 rounded shimmer" style={{width: "88%"}}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent/30 rounded-full animate-spin" style={{animationDirection: "reverse", animationDuration: "1.5s"}}></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display text-primary">Loading StoryShare</h3>
          <p className="text-secondary font-ui">Preparing your reading experience...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading