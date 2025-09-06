// Theme handling for giscus
const getThemeName = (theme: string, giscusContainer: HTMLElement) => {
  if (theme !== "dark" && theme !== "light") {
    return theme
  }
  const darkTheme = giscusContainer.dataset.darkTheme ?? "dark"
  const lightTheme = giscusContainer.dataset.lightTheme ?? "light"
  return theme === "dark" ? darkTheme : lightTheme
}

const getThemeUrl = (theme: string, giscusContainer: HTMLElement) => {
  const themeUrl = giscusContainer.dataset.themeUrl ?? "https://giscus.app/themes"
  return `${themeUrl}/${theme}.css`
}

// Theme change handler
const changeTheme = (e: CustomEventMap["themechange"]) => {
  const theme = e.detail.theme
  const iframe = document.querySelector("iframe.giscus-frame") as HTMLIFrameElement
  const giscusContainer = document.querySelector(".giscus") as HTMLElement

  if (!iframe || !iframe.contentWindow || !giscusContainer) {
    return
  }

  const themeName = getThemeName(theme, giscusContainer)
  const themeUrl = getThemeUrl(themeName, giscusContainer)

  iframe.contentWindow.postMessage(
    {
      giscus: {
        setConfig: {
          theme: themeUrl,
        },
      },
    },
    "https://giscus.app",
  )
}

// Initialize giscus comments with lazy loading
document.addEventListener("nav", () => {
  const giscusContainer = document.querySelector(".giscus") as HTMLElement
  if (!giscusContainer) {
    return
  }

  // Check if giscus script is already loaded
  if (giscusContainer.querySelector("script[src*='giscus.app']")) {
    return
  }

  // Create and configure the giscus script with lazy loading
  const giscusScript = document.createElement("script")
  giscusScript.src = "https://giscus.app/client.js"
  giscusScript.async = true
  giscusScript.crossOrigin = "anonymous"
  giscusScript.setAttribute("data-repo", giscusContainer.dataset.repo!)
  giscusScript.setAttribute("data-repo-id", giscusContainer.dataset.repoId!)
  giscusScript.setAttribute("data-category", giscusContainer.dataset.category!)
  giscusScript.setAttribute("data-category-id", giscusContainer.dataset.categoryId!)
  giscusScript.setAttribute("data-mapping", giscusContainer.dataset.mapping!)
  giscusScript.setAttribute("data-strict", giscusContainer.dataset.strict!)
  giscusScript.setAttribute("data-reactions-enabled", giscusContainer.dataset.reactionsEnabled!)
  giscusScript.setAttribute("data-input-position", giscusContainer.dataset.inputPosition!)
  giscusScript.setAttribute("data-lang", giscusContainer.dataset.lang!)
  giscusScript.setAttribute("data-loading", "lazy")
  giscusScript.setAttribute("data-emit-metadata", "0")

  // Set theme based on current theme
  const theme = document.documentElement.getAttribute("saved-theme") || "light"
  const themeName = getThemeName(theme, giscusContainer)
  const themeUrl = getThemeUrl(themeName, giscusContainer)
  giscusScript.setAttribute("data-theme", themeUrl)

  // Add the script to load giscus
  giscusContainer.appendChild(giscusScript)

  // Set up theme change listener
  document.addEventListener("themechange", changeTheme)
  window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
})
