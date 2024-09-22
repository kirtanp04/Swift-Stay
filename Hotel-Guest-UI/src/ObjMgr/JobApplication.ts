export enum enumApplicationStatus {
    APPLIED = 'applied',
    UNDER_REVIEW = 'under review',
    INTERVIEW_SCHEDULED = 'interview scheduled',
    OFFERED = 'offered',
    REJECTED = 'rejected',
}

export class JobApplication {

    _id: string = "";

    jobId: string = "";

    userId: string = "";

    name: string = "";

    email: string = "";

    phone: string = "";

    resumeUrl: string = "";

    coverLetter: string = "";

    status: enumApplicationStatus = enumApplicationStatus.APPLIED

    experience: string = "";

    skills: string[] = [];

    appliedAt: Date = new Date()

    updatedAt: Date = new Date()
}