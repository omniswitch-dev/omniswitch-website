export const themeColors = { light: '#fcfcfd', dark: '#131217' }

export function applyThemeColor() {
  const theme = document.documentElement.dataset.theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColors[theme] || themeColors.light)
}
