import { NavigationActions, NavigationContainerComponent } from "react-navigation";

let navigator: NavigationContainerComponent | null = null;

export function setRootNavigator(navigatorRef: NavigationContainerComponent | null) {
    navigator = navigatorRef;
}

export function navigateTo(routeName: string): void {
    navigator && navigator.dispatch(
        NavigationActions.navigate({
            action: {
                type: NavigationActions.NAVIGATE,
                routeName,
            },
            routeName,
        })
    );
}
