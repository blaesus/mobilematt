export function dedupeById<V extends {id: string}>(value: V, index: number, array: V[]): boolean {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i].id === value.id && i < index) {
            return false
        }
    }
    return true
}

export function last<V>(things: V[]): V | undefined {
    return things[things.length - 1]
}

export type MapById<V extends {id: string}> = {[id in string]: V};
