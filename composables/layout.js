import { computed, reactive, readonly } from "vue";

const layoutConfig = reactive({
    preset: "Aura",
    primary: "indigo",
    surface: null,
    darkTheme: false,
    menuMode: "static",
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null,
});

export function useLayout() {
    const setPrimary = (value) => {
        layoutConfig.primary = value;
    };

    const setSurface = (value) => {
        layoutConfig.surface = value;
    };

    const setPreset = (value) => {
        layoutConfig.preset = value;
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const setMenuMode = (mode) => {
        layoutConfig.menuMode = mode;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }
        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = () => {
        console.log(
            "typeof layoutConfig.darkTheme",
            typeof layoutConfig.darkTheme,
        );
        // Convert to boolean if it's a string
        if (typeof layoutConfig.darkTheme === "string") {
            layoutConfig.darkTheme = layoutConfig.darkTheme === "true";
        }

        layoutConfig.darkTheme = !layoutConfig.darkTheme;

        localStorage.setItem("app-dark", layoutConfig.darkTheme.toString());
        document.documentElement.classList.toggle("app-dark");
    };

    const initDarkMode = () => {
        console.log("initDarkMode");
        const value = localStorage.getItem("app-dark");
        if (value) {
            layoutConfig.darkTheme = value === "true";
        }

        if (value === "true") {
            document.documentElement.classList.add("app-dark");
            return;
        } else {
            document.documentElement.classList.remove("app-dark");
        }
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === "overlay") {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive =
                !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive =
                !layoutState.staticMenuMobileActive;
        }
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
    };

    const isSidebarActive = computed(
        () =>
            layoutState.overlayMenuActive || layoutState.staticMenuMobileActive,
    );

    const isDarkTheme = computed(() => {
        return layoutConfig.darkTheme;
    });

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig: readonly(layoutConfig),
        layoutState: readonly(layoutState),
        onMenuToggle,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode,
        initDarkMode,
        setPrimary,
        setSurface,
        setPreset,
        resetMenu,
        setMenuMode,
    };
}
