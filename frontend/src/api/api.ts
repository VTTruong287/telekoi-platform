import { ReferenceService } from "./reference";

class ApiService {
    public reference?: ReferenceService
    constructor() {
        this.reference = new ReferenceService()
    }
}

export const apiService = new ApiService();
