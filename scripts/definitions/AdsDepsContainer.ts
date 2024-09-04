import { IAdsDependencies } from "./IAdsDependencies";


export class AdsDepsContainer {
    static getDeps(): IAdsDependencies {
        return AdsDepsContainer.deps;
    }

    static setDeps(deps: IAdsDependencies) {
        AdsDepsContainer.deps = deps;
    }

    private static deps: IAdsDependencies;
}
