export class AppSyncUtilError extends Error {
    public errorType: string | undefined;
    public data: any;
    public errorInfo: any;

    private static lastError: AppSyncUtilError | null;
    public static getLastError(): AppSyncUtilError | null {
        return AppSyncUtilError.lastError;
    }
    public static clearLastError(): void {
        AppSyncUtilError.lastError = null;
    }

    constructor(message: string, errorType?: string, data?: any, errorInfo?: any) {
        super(message);
        this.errorType = errorType;
        this.data = data;
        this.errorInfo = errorInfo;
        AppSyncUtilError.lastError = this;
    }
}

export function error(message: string, errorType?: string, data?: any, errorInfo?: any): AppSyncUtilError {
    throw new AppSyncUtilError(message, errorType, data, errorInfo);
}
