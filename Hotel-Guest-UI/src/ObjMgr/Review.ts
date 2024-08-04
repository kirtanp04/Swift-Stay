import { _Register } from "src/pages/Authentication/AuthMgr"
import { Property } from "./Property"

export class ReviewInfo {
    user: _Register = new _Register()
    message: string = ''
    rating: number = 0
    createAt: Date = new Date()
}

export class Review {
    property: Property = new Property()
    reviewInfo: ReviewInfo[] = []
}