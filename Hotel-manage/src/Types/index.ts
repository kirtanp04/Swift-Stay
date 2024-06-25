import { ReactNode } from "react"

export interface TMenuList {
    name: string

    icon: ReactNode

    path: string
}


export interface StorageError {
    module: string,
    error: any,
    date: Date
}