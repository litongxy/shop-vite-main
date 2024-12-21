/**
 * @description 4个子配置，cli配置|通用配置|主题配置|网络配置导出
 */
import { cliConfig } from '/@/config/cli.config'
import { netConfig } from '/@/config/net.config'
import { settingConfig } from '/@/config/setting.config'
import { themeConfig } from '/@/config/theme.config'

const config: { [key: string]: any } = {
  ...cliConfig,
  ...netConfig,
  ...settingConfig,
  ...themeConfig,
}

export default config

export const {
  abbreviation,
  assetsDir,
  authentication,
  base,
  chunkSizeWarningLimit,
  disableRouterWarning,
  color,
  colorWeakness,
  columnStyle,
  compress,
  contentType,
  copyright,
  cssCodeSplit,
  debounce,
  defaultOpeneds,
  errorLog,
  exclude,
  fixedHeader,
  foldSidebar,
  fontSize,
  https,
  i18n,
  include,
  isFollow,
  isHashRouterMode,
  keepAliveMaxNum,
  layout,
  loadingText,
  localEnabled,
  loginInterception,
  loginRSA,
  logo,
  menuWidth,
  messageDuration,
  messageName,
  minify,
  disableDebugger,
  open,
  openFirstMenu,
  outDir,
  outputHash,
  pageTransition,
  persistenceTab,
  port,
  prodEnabled,
  pwa,
  pwaDev,
  radius,
  recordRoute,
  report,
  reportCompressedSize,
  rolesControl,
  routesWhiteList,
  showColorPicker,
  showDark,
  showFontSize,
  showFooter,
  showFullScreen,
  showLanguage,
  showLock,
  showNotice,
  showProgressBar,
  showRefresh,
  showSearch,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  statusName,
  storage,
  successCode,
  supportVisit,
  tabDrag,
  tabsBarStyle,
  themeName,
  timeout,
  title,
  titleReverse,
  titleSeparator,
  tokenName,
  tokenTableName,
  uniqueOpened,
  columnDrag,
  rightToolsDrag,
} = config
