import { AssessmentValue } from "../../pages/Assessment/NewAssessment/AllAssessments";

export interface FileUploadProps {
  open: boolean;
  onSuccess?: (file: any) => void;
  onStart?: () => void;
  onError?: (message: string) => void;
  onClose?: () => void;
  onProgress?: (progress: number) => void;
  allowedFileTypes?: string[];
  uploadEndpoint?: string;
  onHeightChange?: (newHeight: number) => void;
  assessmentId?: number;
  onFileChanged?: (file: File) => void;
  topicId?: number;
  isSubtopic?: boolean;
  setAssessmentsValue?: (value: any) => void;
  assessmentsValues?: Record<number, AssessmentValue>;
}

export interface FileProps {
  lastModifiedDate?: number;
  name: string;
  size: number;
  type: string;
}
