export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approvedclaimscporeview: {
        Row: {
          CPORApprovedDate: string | null
          CPORDocumentationCompleteDate: string | null
          CPORID: number
          CPORStatus: string | null
          CPORSubmissionDate: string | null
          IncidentType: string | null
          IRN: number | null
          LockedByCPOID: string | null
        }
        Insert: {
          CPORApprovedDate?: string | null
          CPORDocumentationCompleteDate?: string | null
          CPORID: number
          CPORStatus?: string | null
          CPORSubmissionDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
          LockedByCPOID?: string | null
        }
        Update: {
          CPORApprovedDate?: string | null
          CPORDocumentationCompleteDate?: string | null
          CPORID?: number
          CPORStatus?: string | null
          CPORSubmissionDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
          LockedByCPOID?: string | null
        }
        Relationships: []
      }
      attachmentmaster: {
        Row: {
          AttachmentID: number
          AttachmentType: string | null
          FolderName: string | null
          FormType: string | null
          Mandatory: number | null
        }
        Insert: {
          AttachmentID: number
          AttachmentType?: string | null
          FolderName?: string | null
          FormType?: string | null
          Mandatory?: number | null
        }
        Update: {
          AttachmentID?: number
          AttachmentType?: string | null
          FolderName?: string | null
          FormType?: string | null
          Mandatory?: number | null
        }
        Relationships: []
      }
      bankaccountdepositmaster: {
        Row: {
          BADMID: number
          BankName: string | null
          Drawer: number | null
          EbankAmountPaid: number | null
          EbankIssuedDate: string | null
          EbankReferenceNo: number | null
          IRN: number | null
        }
        Insert: {
          BADMID: number
          BankName?: string | null
          Drawer?: number | null
          EbankAmountPaid?: number | null
          EbankIssuedDate?: string | null
          EbankReferenceNo?: number | null
          IRN?: number | null
        }
        Update: {
          BADMID?: number
          BankName?: string | null
          Drawer?: number | null
          EbankAmountPaid?: number | null
          EbankIssuedDate?: string | null
          EbankReferenceNo?: number | null
          IRN?: number | null
        }
        Relationships: []
      }
      claimcompensationpersonaldetails: {
        Row: {
          CCPDCompensationAmount: string | null
          CCPDDegreeOfDependance: string | null
          CCPDID: number
          CCPDPersonDOB: string | null
          CCPDPersonFirstName: string | null
          CCPDPersonLastName: string | null
          CCPDRelationToWorker: string | null
          CCPDWeeklyCompensationAmount: string | null
          IRN: number | null
        }
        Insert: {
          CCPDCompensationAmount?: string | null
          CCPDDegreeOfDependance?: string | null
          CCPDID: number
          CCPDPersonDOB?: string | null
          CCPDPersonFirstName?: string | null
          CCPDPersonLastName?: string | null
          CCPDRelationToWorker?: string | null
          CCPDWeeklyCompensationAmount?: string | null
          IRN?: number | null
        }
        Update: {
          CCPDCompensationAmount?: string | null
          CCPDDegreeOfDependance?: string | null
          CCPDID?: number
          CCPDPersonDOB?: string | null
          CCPDPersonFirstName?: string | null
          CCPDPersonLastName?: string | null
          CCPDRelationToWorker?: string | null
          CCPDWeeklyCompensationAmount?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      claimcompensationworkerdetails: {
        Row: {
          CCWDAnnualWage: number | null
          CCWDCompensationAmount: number | null
          CCWDDeductions: string | null
          CCWDDeductionsNotes: string | null
          CCWDFindings: string | null
          CCWDID: number
          CCWDMedicalExpenses: string | null
          CCWDMiscExpenses: string | null
          CCWDRecommendations: string | null
          CCWDWorkerDOB: string | null
          CCWDWorkerFirstName: string | null
          CCWDWorkerLastName: string | null
          IRN: number | null
        }
        Insert: {
          CCWDAnnualWage?: number | null
          CCWDCompensationAmount?: number | null
          CCWDDeductions?: string | null
          CCWDDeductionsNotes?: string | null
          CCWDFindings?: string | null
          CCWDID: number
          CCWDMedicalExpenses?: string | null
          CCWDMiscExpenses?: string | null
          CCWDRecommendations?: string | null
          CCWDWorkerDOB?: string | null
          CCWDWorkerFirstName?: string | null
          CCWDWorkerLastName?: string | null
          IRN?: number | null
        }
        Update: {
          CCWDAnnualWage?: number | null
          CCWDCompensationAmount?: number | null
          CCWDDeductions?: string | null
          CCWDDeductionsNotes?: string | null
          CCWDFindings?: string | null
          CCWDID?: number
          CCWDMedicalExpenses?: string | null
          CCWDMiscExpenses?: string | null
          CCWDRecommendations?: string | null
          CCWDWorkerDOB?: string | null
          CCWDWorkerFirstName?: string | null
          CCWDWorkerLastName?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      claimsawarded: {
        Row: {
          CAID: string
          CertificateAwarded: string | null
          CertificateAwardedDate: string | null
          IncidentType: string | null
          IRN: string | null
          WorkerAcceptedDate: string | null
        }
        Insert: {
          CAID: string
          CertificateAwarded?: string | null
          CertificateAwardedDate?: string | null
          IncidentType?: string | null
          IRN?: string | null
          WorkerAcceptedDate?: string | null
        }
        Update: {
          CAID?: string
          CertificateAwarded?: string | null
          CertificateAwardedDate?: string | null
          IncidentType?: string | null
          IRN?: string | null
          WorkerAcceptedDate?: string | null
        }
        Relationships: []
      }
      claimsawardedcommissionersreview: {
        Row: {
          CACRDecisionDate: string | null
          CACRDecisionReason: string | null
          CACRID: number
          CACRReviewStatus: string | null
          CACRSubmissionDate: string | null
          ClaimType: string | null
          IncidentType: string | null
          IRN: number | null
          LockedByID: number | null
        }
        Insert: {
          CACRDecisionDate?: string | null
          CACRDecisionReason?: string | null
          CACRID: number
          CACRReviewStatus?: string | null
          CACRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
          LockedByID?: number | null
        }
        Update: {
          CACRDecisionDate?: string | null
          CACRDecisionReason?: string | null
          CACRID?: number
          CACRReviewStatus?: string | null
          CACRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
          LockedByID?: number | null
        }
        Relationships: []
      }
      claimsawardedpaymentsectionreview: {
        Row: {
          CAPSRID: number
          CAPSRNotes: string | null
          CAPSRReviewDate: string | null
          CAPSRReviewStatus: string | null
          CAPSRSubmissionDate: string | null
          ClaimType: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CAPSRID: number
          CAPSRNotes?: string | null
          CAPSRReviewDate?: string | null
          CAPSRReviewStatus?: string | null
          CAPSRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CAPSRID?: number
          CAPSRNotes?: string | null
          CAPSRReviewDate?: string | null
          CAPSRReviewStatus?: string | null
          CAPSRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      claimsawardedregistrarreview: {
        Row: {
          CARRDecisionDate: string | null
          CARRDecisionReason: string | null
          CARRID: number
          CARRReviewStatus: string | null
          CARRSubmissionDate: string | null
          ClaimType: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CARRDecisionDate?: string | null
          CARRDecisionReason?: string | null
          CARRID: number
          CARRReviewStatus?: string | null
          CARRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CARRDecisionDate?: string | null
          CARRDecisionReason?: string | null
          CARRID?: number
          CARRReviewStatus?: string | null
          CARRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      compensationcalculationcommissionersreview: {
        Row: {
          CCCRDecisionDate: string | null
          CCCRDecisionReason: string | null
          CCCRID: number
          CCCRReviewStatus: string | null
          CCCRSubmissionDate: string | null
          ClaimType: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CCCRDecisionDate?: string | null
          CCCRDecisionReason?: string | null
          CCCRID: number
          CCCRReviewStatus?: string | null
          CCCRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CCCRDecisionDate?: string | null
          CCCRDecisionReason?: string | null
          CCCRID?: number
          CCCRReviewStatus?: string | null
          CCCRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      compensationcalculationcpmreview: {
        Row: {
          CPMRDecisionDate: string | null
          CPMRDecisionReason: string | null
          CPMRID: number
          CPMRStatus: string | null
          CPMRSubmissionDate: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CPMRDecisionDate?: string | null
          CPMRDecisionReason?: string | null
          CPMRID: number
          CPMRStatus?: string | null
          CPMRSubmissionDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CPMRDecisionDate?: string | null
          CPMRDecisionReason?: string | null
          CPMRID?: number
          CPMRStatus?: string | null
          CPMRSubmissionDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      compensationcalculationreview: {
        Row: {
          CCRDecisionDate: string | null
          CCRDecisionReason: string | null
          CCRID: number
          CCRReviewStatus: string | null
          CCRSubmissionDate: string | null
          ClaimType: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CCRDecisionDate?: string | null
          CCRDecisionReason?: string | null
          CCRID: number
          CCRReviewStatus?: string | null
          CCRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CCRDecisionDate?: string | null
          CCRDecisionReason?: string | null
          CCRID?: number
          CCRReviewStatus?: string | null
          CCRSubmissionDate?: string | null
          ClaimType?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      currentemploymentdetails: {
        Row: {
          AverageWeeklyWage: number | null
          CEDID: number
          EmployerCPPSID: string | null
          EmploymentID: string | null
          NatureOfEmployment: string | null
          Occupation: string | null
          OrganizationType: string | null
          PlaceOfEmployment: string | null
          SubContractorLocation: string | null
          SubContractorNatureOfBusiness: string | null
          SubContractorOrganizationName: string | null
          WeeklyPaymentRate: number | null
          WorkedUnderSubContractor: string | null
          WorkerID: number | null
        }
        Insert: {
          AverageWeeklyWage?: number | null
          CEDID: number
          EmployerCPPSID?: string | null
          EmploymentID?: string | null
          NatureOfEmployment?: string | null
          Occupation?: string | null
          OrganizationType?: string | null
          PlaceOfEmployment?: string | null
          SubContractorLocation?: string | null
          SubContractorNatureOfBusiness?: string | null
          SubContractorOrganizationName?: string | null
          WeeklyPaymentRate?: number | null
          WorkedUnderSubContractor?: string | null
          WorkerID?: number | null
        }
        Update: {
          AverageWeeklyWage?: number | null
          CEDID?: number
          EmployerCPPSID?: string | null
          EmploymentID?: string | null
          NatureOfEmployment?: string | null
          Occupation?: string | null
          OrganizationType?: string | null
          PlaceOfEmployment?: string | null
          SubContractorLocation?: string | null
          SubContractorNatureOfBusiness?: string | null
          SubContractorOrganizationName?: string | null
          WeeklyPaymentRate?: number | null
          WorkedUnderSubContractor?: string | null
          WorkerID?: number | null
        }
        Relationships: []
      }
      dependantpersonaldetails: {
        Row: {
          DependanceDegree: string | null
          DependantAddress1: string | null
          DependantAddress2: string | null
          DependantCity: string | null
          DependantDOB: string | null
          DependantEmail: string | null
          DependantFirstName: string | null
          DependantGender: string | null
          DependantID: number
          DependantLandline: string | null
          DependantLastName: string | null
          DependantMobile: string | null
          DependantPOBox: string | null
          DependantProvince: string | null
          DependantType: string | null
          WorkerID: number | null
        }
        Insert: {
          DependanceDegree?: string | null
          DependantAddress1?: string | null
          DependantAddress2?: string | null
          DependantCity?: string | null
          DependantDOB?: string | null
          DependantEmail?: string | null
          DependantFirstName?: string | null
          DependantGender?: string | null
          DependantID: number
          DependantLandline?: string | null
          DependantLastName?: string | null
          DependantMobile?: string | null
          DependantPOBox?: string | null
          DependantProvince?: string | null
          DependantType?: string | null
          WorkerID?: number | null
        }
        Update: {
          DependanceDegree?: string | null
          DependantAddress1?: string | null
          DependantAddress2?: string | null
          DependantCity?: string | null
          DependantDOB?: string | null
          DependantEmail?: string | null
          DependantFirstName?: string | null
          DependantGender?: string | null
          DependantID?: number
          DependantLandline?: string | null
          DependantLastName?: string | null
          DependantMobile?: string | null
          DependantPOBox?: string | null
          DependantProvince?: string | null
          DependantType?: string | null
          WorkerID?: number | null
        }
        Relationships: []
      }
      dictionary: {
        Row: {
          DKey: string | null
          DType: string | null
          DValue: string | null
          ID: number
        }
        Insert: {
          DKey?: string | null
          DType?: string | null
          DValue?: string | null
          ID: number
        }
        Update: {
          DKey?: string | null
          DType?: string | null
          DValue?: string | null
          ID?: number
        }
        Relationships: []
      }
      dofmaster: {
        Row: {
          DepartmentCode: string | null
          DepartmentName: string | null
          DOFID: number
        }
        Insert: {
          DepartmentCode?: string | null
          DepartmentName?: string | null
          DOFID: number
        }
        Update: {
          DepartmentCode?: string | null
          DepartmentName?: string | null
          DOFID?: number
        }
        Relationships: []
      }
      employermaster: {
        Row: {
          Address1: string | null
          Address2: string | null
          City: string | null
          CPPSID: string | null
          EMID: number
          EmployerID: number | null
          Fax: string | null
          IncorporationDate: string | null
          InsuranceProviderIPACode: string | null
          IsAgent: string | null
          IsInsuranceCompany: string | null
          IsLawyer: string | null
          IsLevyPaid: string | null
          LandLine: string | null
          Latitude: string | null
          LevyReferenceNumber: string | null
          Longitude: string | null
          MobilePhone: string | null
          OrganizationName: string | null
          OrganizationType: string | null
          POBox: string | null
          Province: string | null
          ValidationCode: string | null
          Website: string | null
        }
        Insert: {
          Address1?: string | null
          Address2?: string | null
          City?: string | null
          CPPSID?: string | null
          EMID: number
          EmployerID?: number | null
          Fax?: string | null
          IncorporationDate?: string | null
          InsuranceProviderIPACode?: string | null
          IsAgent?: string | null
          IsInsuranceCompany?: string | null
          IsLawyer?: string | null
          IsLevyPaid?: string | null
          LandLine?: string | null
          Latitude?: string | null
          LevyReferenceNumber?: string | null
          Longitude?: string | null
          MobilePhone?: string | null
          OrganizationName?: string | null
          OrganizationType?: string | null
          POBox?: string | null
          Province?: string | null
          ValidationCode?: string | null
          Website?: string | null
        }
        Update: {
          Address1?: string | null
          Address2?: string | null
          City?: string | null
          CPPSID?: string | null
          EMID?: number
          EmployerID?: number | null
          Fax?: string | null
          IncorporationDate?: string | null
          InsuranceProviderIPACode?: string | null
          IsAgent?: string | null
          IsInsuranceCompany?: string | null
          IsLawyer?: string | null
          IsLevyPaid?: string | null
          LandLine?: string | null
          Latitude?: string | null
          LevyReferenceNumber?: string | null
          Longitude?: string | null
          MobilePhone?: string | null
          OrganizationName?: string | null
          OrganizationType?: string | null
          POBox?: string | null
          Province?: string | null
          ValidationCode?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      form1112master: {
        Row: {
          DisplayIRN: string | null
          FirstSubmissionDate: string | null
          GradualProcessInjury: string | null
          HandInjury: number | null
          ImageName: string | null
          ImageName2: string | null
          IncidentDate: string | null
          IncidentLocation: string | null
          IncidentProvince: string | null
          IncidentRegion: string | null
          IncidentType: string | null
          InjuryCause: string | null
          InjuryMachinery: string | null
          InsuranceProviderIPACode: string | null
          IRN: number
          MachinePartResponsible: string | null
          MachinePowerSource: string | null
          MachineType: string | null
          NatureExtentInjury: string | null
          TimeBarred: string | null
          WorkerID: number | null
        }
        Insert: {
          DisplayIRN?: string | null
          FirstSubmissionDate?: string | null
          GradualProcessInjury?: string | null
          HandInjury?: number | null
          ImageName?: string | null
          ImageName2?: string | null
          IncidentDate?: string | null
          IncidentLocation?: string | null
          IncidentProvince?: string | null
          IncidentRegion?: string | null
          IncidentType?: string | null
          InjuryCause?: string | null
          InjuryMachinery?: string | null
          InsuranceProviderIPACode?: string | null
          IRN: number
          MachinePartResponsible?: string | null
          MachinePowerSource?: string | null
          MachineType?: string | null
          NatureExtentInjury?: string | null
          TimeBarred?: string | null
          WorkerID?: number | null
        }
        Update: {
          DisplayIRN?: string | null
          FirstSubmissionDate?: string | null
          GradualProcessInjury?: string | null
          HandInjury?: number | null
          ImageName?: string | null
          ImageName2?: string | null
          IncidentDate?: string | null
          IncidentLocation?: string | null
          IncidentProvince?: string | null
          IncidentRegion?: string | null
          IncidentType?: string | null
          InjuryCause?: string | null
          InjuryMachinery?: string | null
          InsuranceProviderIPACode?: string | null
          IRN?: number
          MachinePartResponsible?: string | null
          MachinePowerSource?: string | null
          MachineType?: string | null
          NatureExtentInjury?: string | null
          TimeBarred?: string | null
          WorkerID?: number | null
        }
        Relationships: []
      }
      form17master: {
        Row: {
          EmployerCPPSID: string | null
          F17MID: number
          F17MStatus: string | null
          F17MWorkerDecisionReason: string | null
          F17MWorkerRejectedDate: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          EmployerCPPSID?: string | null
          F17MID: number
          F17MStatus?: string | null
          F17MWorkerDecisionReason?: string | null
          F17MWorkerRejectedDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          EmployerCPPSID?: string | null
          F17MID?: number
          F17MStatus?: string | null
          F17MWorkerDecisionReason?: string | null
          F17MWorkerRejectedDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      form18master: {
        Row: {
          EmployerCPPSID: string | null
          F18MEmployerAcceptedDate: string | null
          F18MEmployerDecisionReason: string | null
          F18MID: number
          F18MStatus: string | null
          F18MWorkerAcceptedDate: string | null
          F18MWorkerDecisionReason: string | null
          F18MWorkerNotifiedDate: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          EmployerCPPSID?: string | null
          F18MEmployerAcceptedDate?: string | null
          F18MEmployerDecisionReason?: string | null
          F18MID: number
          F18MStatus?: string | null
          F18MWorkerAcceptedDate?: string | null
          F18MWorkerDecisionReason?: string | null
          F18MWorkerNotifiedDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          EmployerCPPSID?: string | null
          F18MEmployerAcceptedDate?: string | null
          F18MEmployerDecisionReason?: string | null
          F18MID?: number
          F18MStatus?: string | null
          F18MWorkerAcceptedDate?: string | null
          F18MWorkerDecisionReason?: string | null
          F18MWorkerNotifiedDate?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      form3master: {
        Row: {
          AllowanceReceived: string | null
          ApplicantAddress1: string | null
          ApplicantAddress2: string | null
          ApplicantCity: string | null
          ApplicantEmail: string | null
          ApplicantFirstName: string | null
          ApplicantLandline: string | null
          ApplicantLastName: string | null
          ApplicantMobile: string | null
          ApplicantPOBox: string | null
          ApplicantProvince: string | null
          AverageEarnableAmount: number | null
          CompensationClaimDetails: string | null
          DisabilitiesDescription: string | null
          EstimatedIncapacityDuration: string | null
          F3MRecordID: number
          Form3ImageName: string | null
          Form3SubmissionDate: string | null
          IncapacityDescription: string | null
          IncapacityExtent: string | null
          IncidentDescription: string | null
          IRN: number | null
          WorkerID: number | null
        }
        Insert: {
          AllowanceReceived?: string | null
          ApplicantAddress1?: string | null
          ApplicantAddress2?: string | null
          ApplicantCity?: string | null
          ApplicantEmail?: string | null
          ApplicantFirstName?: string | null
          ApplicantLandline?: string | null
          ApplicantLastName?: string | null
          ApplicantMobile?: string | null
          ApplicantPOBox?: string | null
          ApplicantProvince?: string | null
          AverageEarnableAmount?: number | null
          CompensationClaimDetails?: string | null
          DisabilitiesDescription?: string | null
          EstimatedIncapacityDuration?: string | null
          F3MRecordID: number
          Form3ImageName?: string | null
          Form3SubmissionDate?: string | null
          IncapacityDescription?: string | null
          IncapacityExtent?: string | null
          IncidentDescription?: string | null
          IRN?: number | null
          WorkerID?: number | null
        }
        Update: {
          AllowanceReceived?: string | null
          ApplicantAddress1?: string | null
          ApplicantAddress2?: string | null
          ApplicantCity?: string | null
          ApplicantEmail?: string | null
          ApplicantFirstName?: string | null
          ApplicantLandline?: string | null
          ApplicantLastName?: string | null
          ApplicantMobile?: string | null
          ApplicantPOBox?: string | null
          ApplicantProvince?: string | null
          AverageEarnableAmount?: number | null
          CompensationClaimDetails?: string | null
          DisabilitiesDescription?: string | null
          EstimatedIncapacityDuration?: string | null
          F3MRecordID?: number
          Form3ImageName?: string | null
          Form3SubmissionDate?: string | null
          IncapacityDescription?: string | null
          IncapacityExtent?: string | null
          IncidentDescription?: string | null
          IRN?: number | null
          WorkerID?: number | null
        }
        Relationships: []
      }
      form4master: {
        Row: {
          AnnualEarningsAtDeath: number | null
          ApplicantAddress1: string | null
          ApplicantAddress2: string | null
          ApplicantCity: string | null
          ApplicantEmail: string | null
          ApplicantFirstName: string | null
          ApplicantLandline: string | null
          ApplicantLastName: string | null
          ApplicantMobile: string | null
          ApplicantPOBox: string | null
          ApplicantProvince: string | null
          CompensationBenefitDetails: string | null
          CompensationBenefitsPriorToDeath: string | null
          CompensationClaimed: string | null
          F4MRecordID: number
          Form4ImageName: string | null
          Form4SubmissionDate: string | null
          FuneralExpenseDetails: string | null
          IncidentDescription: string | null
          IRN: number | null
          MedicalExpenseDetails: string | null
          WorkerID: number | null
        }
        Insert: {
          AnnualEarningsAtDeath?: number | null
          ApplicantAddress1?: string | null
          ApplicantAddress2?: string | null
          ApplicantCity?: string | null
          ApplicantEmail?: string | null
          ApplicantFirstName?: string | null
          ApplicantLandline?: string | null
          ApplicantLastName?: string | null
          ApplicantMobile?: string | null
          ApplicantPOBox?: string | null
          ApplicantProvince?: string | null
          CompensationBenefitDetails?: string | null
          CompensationBenefitsPriorToDeath?: string | null
          CompensationClaimed?: string | null
          F4MRecordID: number
          Form4ImageName?: string | null
          Form4SubmissionDate?: string | null
          FuneralExpenseDetails?: string | null
          IncidentDescription?: string | null
          IRN?: number | null
          MedicalExpenseDetails?: string | null
          WorkerID?: number | null
        }
        Update: {
          AnnualEarningsAtDeath?: number | null
          ApplicantAddress1?: string | null
          ApplicantAddress2?: string | null
          ApplicantCity?: string | null
          ApplicantEmail?: string | null
          ApplicantFirstName?: string | null
          ApplicantLandline?: string | null
          ApplicantLastName?: string | null
          ApplicantMobile?: string | null
          ApplicantPOBox?: string | null
          ApplicantProvince?: string | null
          CompensationBenefitDetails?: string | null
          CompensationBenefitsPriorToDeath?: string | null
          CompensationClaimed?: string | null
          F4MRecordID?: number
          Form4ImageName?: string | null
          Form4SubmissionDate?: string | null
          FuneralExpenseDetails?: string | null
          IncidentDescription?: string | null
          IRN?: number | null
          MedicalExpenseDetails?: string | null
          WorkerID?: number | null
        }
        Relationships: []
      }
      form6master: {
        Row: {
          CPOInCharge: string | null
          EmployerCPPSID: string | null
          F6MApprovalDate: string | null
          F6MID: number
          F6MStatus: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          CPOInCharge?: string | null
          EmployerCPPSID?: string | null
          F6MApprovalDate?: string | null
          F6MID: number
          F6MStatus?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          CPOInCharge?: string | null
          EmployerCPPSID?: string | null
          F6MApprovalDate?: string | null
          F6MID?: number
          F6MStatus?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      form7master: {
        Row: {
          EmployerCPPSID: string | null
          F7MEmployerDecisionReason: string | null
          F7MEmployerRejectedDate: string | null
          F7MID: number
          F7MStatus: string | null
          IncidentType: string | null
          IRN: number | null
        }
        Insert: {
          EmployerCPPSID?: string | null
          F7MEmployerDecisionReason?: string | null
          F7MEmployerRejectedDate?: string | null
          F7MID: number
          F7MStatus?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Update: {
          EmployerCPPSID?: string | null
          F7MEmployerDecisionReason?: string | null
          F7MEmployerRejectedDate?: string | null
          F7MID?: number
          F7MStatus?: string | null
          IncidentType?: string | null
          IRN?: number | null
        }
        Relationships: []
      }
      formattachments: {
        Row: {
          AttachmentType: string | null
          FileName: string | null
          FormAttachmentID: number | null
          IRN: number | null
        }
        Insert: {
          AttachmentType?: string | null
          FileName?: string | null
          FormAttachmentID?: number | null
          IRN?: number | null
        }
        Update: {
          AttachmentType?: string | null
          FileName?: string | null
          FormAttachmentID?: number | null
          IRN?: number | null
        }
        Relationships: []
      }
      fosemployeraudit: {
        Row: {
          FEAAuditComments: string | null
          FEAAuditDate: string | null
          FEACPPSID: string | null
          FEAFOSID: number | null
          FEAID: number
        }
        Insert: {
          FEAAuditComments?: string | null
          FEAAuditDate?: string | null
          FEACPPSID?: string | null
          FEAFOSID?: number | null
          FEAID: number
        }
        Update: {
          FEAAuditComments?: string | null
          FEAAuditDate?: string | null
          FEACPPSID?: string | null
          FEAFOSID?: number | null
          FEAID?: number
        }
        Relationships: []
      }
      injurycasechecklist: {
        Row: {
          ICCLCompensationAmount: number | null
          ICCLCriteria: string | null
          ICCLDoctorPercentage: number | null
          ICCLFactor: number | null
          ICCLID: number
          IRN: number | null
        }
        Insert: {
          ICCLCompensationAmount?: number | null
          ICCLCriteria?: string | null
          ICCLDoctorPercentage?: number | null
          ICCLFactor?: number | null
          ICCLID: number
          IRN?: number | null
        }
        Update: {
          ICCLCompensationAmount?: number | null
          ICCLCriteria?: string | null
          ICCLDoctorPercentage?: number | null
          ICCLFactor?: number | null
          ICCLID?: number
          IRN?: number | null
        }
        Relationships: []
      }
      insurancecompanymaster: {
        Row: {
          Fax: string | null
          ICMID: number | null
          InsuranceCompanyAddress1: string | null
          InsuranceCompanyAddress2: string | null
          InsuranceCompanyCity: string | null
          InsuranceCompanyEmailID: string | null
          InsuranceCompanyID: string | null
          InsuranceCompanyIncorporationDate: string | null
          InsuranceCompanyLandLine: string | null
          InsuranceCompanyOrganizationName: string | null
          InsuranceCompanyPOBox: string | null
          InsuranceCompanyProvince: string | null
          IPACODE: string
          Latitude: string | null
          Longitude: string | null
          MobilePhone: string | null
          Website: string | null
        }
        Insert: {
          Fax?: string | null
          ICMID?: number | null
          InsuranceCompanyAddress1?: string | null
          InsuranceCompanyAddress2?: string | null
          InsuranceCompanyCity?: string | null
          InsuranceCompanyEmailID?: string | null
          InsuranceCompanyID?: string | null
          InsuranceCompanyIncorporationDate?: string | null
          InsuranceCompanyLandLine?: string | null
          InsuranceCompanyOrganizationName?: string | null
          InsuranceCompanyPOBox?: string | null
          InsuranceCompanyProvince?: string | null
          IPACODE: string
          Latitude?: string | null
          Longitude?: string | null
          MobilePhone?: string | null
          Website?: string | null
        }
        Update: {
          Fax?: string | null
          ICMID?: number | null
          InsuranceCompanyAddress1?: string | null
          InsuranceCompanyAddress2?: string | null
          InsuranceCompanyCity?: string | null
          InsuranceCompanyEmailID?: string | null
          InsuranceCompanyID?: string | null
          InsuranceCompanyIncorporationDate?: string | null
          InsuranceCompanyLandLine?: string | null
          InsuranceCompanyOrganizationName?: string | null
          InsuranceCompanyPOBox?: string | null
          InsuranceCompanyProvince?: string | null
          IPACODE?: string
          Latitude?: string | null
          Longitude?: string | null
          MobilePhone?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      ipamaster: {
        Row: {
          EntityType: string | null
          IMID: number
          OrgCode: string | null
          OrgName: string | null
        }
        Insert: {
          EntityType?: string | null
          IMID: number
          OrgCode?: string | null
          OrgName?: string | null
        }
        Update: {
          EntityType?: string | null
          IMID?: number
          OrgCode?: string | null
          OrgName?: string | null
        }
        Relationships: []
      }
      owc_assets: {
        Row: {
          id: number
          level: string | null
          lft: string | null
          name: string | null
          parent_id: string | null
          rgt: number | null
          rules: Json | null
          title: string | null
        }
        Insert: {
          id: number
          level?: string | null
          lft?: string | null
          name?: string | null
          parent_id?: string | null
          rgt?: number | null
          rules?: Json | null
          title?: string | null
        }
        Update: {
          id?: number
          level?: string | null
          lft?: string | null
          name?: string | null
          parent_id?: string | null
          rgt?: number | null
          rules?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      owc_categories: {
        Row: {
          access: number | null
          alias: string | null
          asset_id: string | null
          checked_out: string | null
          checked_out_time: string | null
          created_time: string | null
          created_user_id: number | null
          description: string | null
          extension: string | null
          hits: string | null
          id: number
          language: string | null
          level: string | null
          lft: string | null
          metadata: Json | null
          metadesc: string | null
          metakey: string | null
          modified_time: string | null
          modified_user_id: number | null
          note: string | null
          params: Json | null
          parent_id: string | null
          path: string | null
          published: number | null
          rgt: number | null
          title: string | null
          version: number | null
        }
        Insert: {
          access?: number | null
          alias?: string | null
          asset_id?: string | null
          checked_out?: string | null
          checked_out_time?: string | null
          created_time?: string | null
          created_user_id?: number | null
          description?: string | null
          extension?: string | null
          hits?: string | null
          id: number
          language?: string | null
          level?: string | null
          lft?: string | null
          metadata?: Json | null
          metadesc?: string | null
          metakey?: string | null
          modified_time?: string | null
          modified_user_id?: number | null
          note?: string | null
          params?: Json | null
          parent_id?: string | null
          path?: string | null
          published?: number | null
          rgt?: number | null
          title?: string | null
          version?: number | null
        }
        Update: {
          access?: number | null
          alias?: string | null
          asset_id?: string | null
          checked_out?: string | null
          checked_out_time?: string | null
          created_time?: string | null
          created_user_id?: number | null
          description?: string | null
          extension?: string | null
          hits?: string | null
          id?: number
          language?: string | null
          level?: string | null
          lft?: string | null
          metadata?: Json | null
          metadesc?: string | null
          metakey?: string | null
          modified_time?: string | null
          modified_user_id?: number | null
          note?: string | null
          params?: Json | null
          parent_id?: string | null
          path?: string | null
          published?: number | null
          rgt?: number | null
          title?: string | null
          version?: number | null
        }
        Relationships: []
      }
      owc_chronoengine_forms6: {
        Row: {
          alias: string | null
          description: string | null
          events: Json | null
          functions: Json | null
          id: number
          locales: Json | null
          params: Json | null
          public: number | null
          published: string | null
          rules: Json | null
          sections: Json | null
          title: string | null
          views: Json | null
        }
        Insert: {
          alias?: string | null
          description?: string | null
          events?: Json | null
          functions?: Json | null
          id: number
          locales?: Json | null
          params?: Json | null
          public?: number | null
          published?: string | null
          rules?: Json | null
          sections?: Json | null
          title?: string | null
          views?: Json | null
        }
        Update: {
          alias?: string | null
          description?: string | null
          events?: Json | null
          functions?: Json | null
          id?: number
          locales?: Json | null
          params?: Json | null
          public?: number | null
          published?: string | null
          rules?: Json | null
          sections?: Json | null
          title?: string | null
          views?: Json | null
        }
        Relationships: []
      }
      owc_chronoforms8: {
        Row: {
          alias: string | null
          elements: Json | null
          id: number
          params: Json | null
          published: string | null
          title: string | null
        }
        Insert: {
          alias?: string | null
          elements?: Json | null
          id: number
          params?: Json | null
          published?: string | null
          title?: string | null
        }
        Update: {
          alias?: string | null
          elements?: Json | null
          id?: number
          params?: Json | null
          published?: string | null
          title?: string | null
        }
        Relationships: []
      }
      owc_content: {
        Row: {
          alias: string | null
          asset_id: number | null
          catid: number | null
          id: number
          introtext: string | null
          title: string | null
        }
        Insert: {
          alias?: string | null
          asset_id?: number | null
          catid?: number | null
          id: number
          introtext?: string | null
          title?: string | null
        }
        Update: {
          alias?: string | null
          asset_id?: number | null
          catid?: number | null
          id?: number
          introtext?: string | null
          title?: string | null
        }
        Relationships: []
      }
      owc_menu: {
        Row: {
          alias: string | null
          id: number
          link: string | null
          menutype: string | null
          parent_id: string | null
          path: string | null
          published: number | null
          title: string | null
        }
        Insert: {
          alias?: string | null
          id: number
          link?: string | null
          menutype?: string | null
          parent_id?: string | null
          path?: string | null
          published?: number | null
          title?: string | null
        }
        Update: {
          alias?: string | null
          id?: number
          link?: string | null
          menutype?: string | null
          parent_id?: string | null
          path?: string | null
          published?: number | null
          title?: string | null
        }
        Relationships: []
      }
      owc_menu_types: {
        Row: {
          asset_id: number | null
          client_id: string | null
          description: string | null
          id: number
          menutype: string | null
          title: string | null
        }
        Insert: {
          asset_id?: number | null
          client_id?: string | null
          description?: string | null
          id: number
          menutype?: string | null
          title?: string | null
        }
        Update: {
          asset_id?: number | null
          client_id?: string | null
          description?: string | null
          id?: number
          menutype?: string | null
          title?: string | null
        }
        Relationships: []
      }
      owc_modules: {
        Row: {
          access: number | null
          asset_id: number | null
          checked_out: string | null
          checked_out_time: string | null
          client_id: string | null
          content: string | null
          id: number
          language: string | null
          module: string | null
          note: string | null
          ordering: number | null
          params: Json | null
          position: string | null
          publish_down: string | null
          publish_up: string | null
          published: number | null
          showtitle: string | null
          title: string | null
        }
        Insert: {
          access?: number | null
          asset_id?: number | null
          checked_out?: string | null
          checked_out_time?: string | null
          client_id?: string | null
          content?: string | null
          id: number
          language?: string | null
          module?: string | null
          note?: string | null
          ordering?: number | null
          params?: Json | null
          position?: string | null
          publish_down?: string | null
          publish_up?: string | null
          published?: number | null
          showtitle?: string | null
          title?: string | null
        }
        Update: {
          access?: number | null
          asset_id?: number | null
          checked_out?: string | null
          checked_out_time?: string | null
          client_id?: string | null
          content?: string | null
          id?: number
          language?: string | null
          module?: string | null
          note?: string | null
          ordering?: number | null
          params?: Json | null
          position?: string | null
          publish_down?: string | null
          publish_up?: string | null
          published?: number | null
          showtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      owc_user_usergroup_map: {
        Row: {
          group_id: number
          user_id: number
        }
        Insert: {
          group_id: number
          user_id: number
        }
        Update: {
          group_id?: number
          user_id?: number
        }
        Relationships: []
      }
      owc_usergroups: {
        Row: {
          id: number
          lft: number | null
          parent_id: string | null
          rgt: number | null
          title: string | null
        }
        Insert: {
          id: number
          lft?: number | null
          parent_id?: string | null
          rgt?: number | null
          title?: string | null
        }
        Update: {
          id?: number
          lft?: number | null
          parent_id?: string | null
          rgt?: number | null
          title?: string | null
        }
        Relationships: []
      }
      owc_users: {
        Row: {
          activation: string | null
          authProvider: string | null
          block: string | null
          email: string | null
          id: number
          lastResetTime: string | null
          lastvisitDate: string | null
          name: string | null
          otep: string | null
          otpKey: string | null
          params: Json | null
          password: string | null
          registerDate: string | null
          requireReset: string | null
          resetCount: string | null
          sendEmail: string | null
          username: string | null
        }
        Insert: {
          activation?: string | null
          authProvider?: string | null
          block?: string | null
          email?: string | null
          id: number
          lastResetTime?: string | null
          lastvisitDate?: string | null
          name?: string | null
          otep?: string | null
          otpKey?: string | null
          params?: Json | null
          password?: string | null
          registerDate?: string | null
          requireReset?: string | null
          resetCount?: string | null
          sendEmail?: string | null
          username?: string | null
        }
        Update: {
          activation?: string | null
          authProvider?: string | null
          block?: string | null
          email?: string | null
          id?: number
          lastResetTime?: string | null
          lastvisitDate?: string | null
          name?: string | null
          otep?: string | null
          otpKey?: string | null
          params?: Json | null
          password?: string | null
          registerDate?: string | null
          requireReset?: string | null
          resetCount?: string | null
          sendEmail?: string | null
          username?: string | null
        }
        Relationships: []
      }
      owcbankaccountmaster: {
        Row: {
          OBANAccountID: number
          OBANBankAccountNumber: number | null
          OBANBankName: string | null
        }
        Insert: {
          OBANAccountID: number
          OBANBankAccountNumber?: number | null
          OBANBankName?: string | null
        }
        Update: {
          OBANAccountID?: number
          OBANBankAccountNumber?: number | null
          OBANBankName?: string | null
        }
        Relationships: []
      }
      owcclaimchequedetails: {
        Row: {
          ChequeDescription: string | null
          IRN: number | null
          OCCDBankAccountNumber: number | null
          OCCDBankName: string | null
          OCCDBeneficiaryAddress1: string | null
          OCCDBeneficiaryAddress2: string | null
          OCCDBeneficiaryName: string | null
          OCCDBeneficiaryPincode: string | null
          OCCDChequeAmount: number | null
          OCCDChequeNumber: number | null
          OCCDEditReason: string | null
          OCCDID: number
          OCCDIssueDate: string | null
          OCCDSerialNumber: number | null
        }
        Insert: {
          ChequeDescription?: string | null
          IRN?: number | null
          OCCDBankAccountNumber?: number | null
          OCCDBankName?: string | null
          OCCDBeneficiaryAddress1?: string | null
          OCCDBeneficiaryAddress2?: string | null
          OCCDBeneficiaryName?: string | null
          OCCDBeneficiaryPincode?: string | null
          OCCDChequeAmount?: number | null
          OCCDChequeNumber?: number | null
          OCCDEditReason?: string | null
          OCCDID: number
          OCCDIssueDate?: string | null
          OCCDSerialNumber?: number | null
        }
        Update: {
          ChequeDescription?: string | null
          IRN?: number | null
          OCCDBankAccountNumber?: number | null
          OCCDBankName?: string | null
          OCCDBeneficiaryAddress1?: string | null
          OCCDBeneficiaryAddress2?: string | null
          OCCDBeneficiaryName?: string | null
          OCCDBeneficiaryPincode?: string | null
          OCCDChequeAmount?: number | null
          OCCDChequeNumber?: number | null
          OCCDEditReason?: string | null
          OCCDID?: number
          OCCDIssueDate?: string | null
          OCCDSerialNumber?: number | null
        }
        Relationships: []
      }
      owcstaffmaster: {
        Row: {
          CPPSID: string | null
          InchargeProvince: string | null
          InchargeRegion: string | null
          OSMActive: string | null
          OSMDepartment: string | null
          OSMDesignation: string | null
          OSMFirstName: string | null
          OSMID: number
          OSMLastName: string | null
          OSMLocked: number | null
          OSMMobilePhone: number | null
          OSMStaffID: number | null
        }
        Insert: {
          CPPSID?: string | null
          InchargeProvince?: string | null
          InchargeRegion?: string | null
          OSMActive?: string | null
          OSMDepartment?: string | null
          OSMDesignation?: string | null
          OSMFirstName?: string | null
          OSMID: number
          OSMLastName?: string | null
          OSMLocked?: number | null
          OSMMobilePhone?: number | null
          OSMStaffID?: number | null
        }
        Update: {
          CPPSID?: string | null
          InchargeProvince?: string | null
          InchargeRegion?: string | null
          OSMActive?: string | null
          OSMDepartment?: string | null
          OSMDesignation?: string | null
          OSMFirstName?: string | null
          OSMID?: number
          OSMLastName?: string | null
          OSMLocked?: number | null
          OSMMobilePhone?: number | null
          OSMStaffID?: number | null
        }
        Relationships: []
      }
      prescreeningreviewhistory: {
        Row: {
          IRN: number | null
          PRHDecisionDate: string | null
          PRHDecisionReason: string | null
          PRHFormType: string | null
          PRHID: number
          PRHSubmissionDate: string | null
        }
        Insert: {
          IRN?: number | null
          PRHDecisionDate?: string | null
          PRHDecisionReason?: string | null
          PRHFormType?: string | null
          PRHID: number
          PRHSubmissionDate?: string | null
        }
        Update: {
          IRN?: number | null
          PRHDecisionDate?: string | null
          PRHDecisionReason?: string | null
          PRHFormType?: string | null
          PRHID?: number
          PRHSubmissionDate?: string | null
        }
        Relationships: []
      }
      registrarreview: {
        Row: {
          IncidentType: string | null
          IRN: number | null
          RRDecisionDate: string | null
          RRDecisionReason: string | null
          RRID: number
          RRStatus: string | null
          RRSubmissionDate: string | null
        }
        Insert: {
          IncidentType?: string | null
          IRN?: number | null
          RRDecisionDate?: string | null
          RRDecisionReason?: string | null
          RRID: number
          RRStatus?: string | null
          RRSubmissionDate?: string | null
        }
        Update: {
          IncidentType?: string | null
          IRN?: number | null
          RRDecisionDate?: string | null
          RRDecisionReason?: string | null
          RRID?: number
          RRStatus?: string | null
          RRSubmissionDate?: string | null
        }
        Relationships: []
      }
      registrarreviewhistory: {
        Row: {
          IncidentType: string | null
          IRN: number | null
          RRHDecisionDate: string | null
          RRHDecisionReason: string | null
          RRHID: number
          RRHSubmissionDate: string | null
        }
        Insert: {
          IncidentType?: string | null
          IRN?: number | null
          RRHDecisionDate?: string | null
          RRHDecisionReason?: string | null
          RRHID: number
          RRHSubmissionDate?: string | null
        }
        Update: {
          IncidentType?: string | null
          IRN?: number | null
          RRHDecisionDate?: string | null
          RRHDecisionReason?: string | null
          RRHID?: number
          RRHSubmissionDate?: string | null
        }
        Relationships: []
      }
      timebarredclaimsregistrarreview: {
        Row: {
          IRN: number | null
          TBCRRDecisionDate: string | null
          TBCRRDecisionReason: string | null
          TBCRRFormType: string | null
          TBCRRID: number
          TBCRRReviewStatus: string | null
          TBCRRSubmissionDate: string | null
        }
        Insert: {
          IRN?: number | null
          TBCRRDecisionDate?: string | null
          TBCRRDecisionReason?: string | null
          TBCRRFormType?: string | null
          TBCRRID: number
          TBCRRReviewStatus?: string | null
          TBCRRSubmissionDate?: string | null
        }
        Update: {
          IRN?: number | null
          TBCRRDecisionDate?: string | null
          TBCRRDecisionReason?: string | null
          TBCRRFormType?: string | null
          TBCRRID?: number
          TBCRRReviewStatus?: string | null
          TBCRRSubmissionDate?: string | null
        }
        Relationships: []
      }
      tribunalhearingoutcome: {
        Row: {
          THOActionOfficer: string | null
          THOClaimant: string | null
          THOConfirmedAmount: string | null
          THODecision: string | null
          THODOA: string | null
          THOEmployer: string | null
          THOHearingNo: string | null
          THOHearingStatus: string | null
          THOID: number
          THOIRN: number | null
          THONatureOfAccident: string | null
          THOProposedAmount: string | null
          THOReason: string | null
          THORegion: string | null
        }
        Insert: {
          THOActionOfficer?: string | null
          THOClaimant?: string | null
          THOConfirmedAmount?: string | null
          THODecision?: string | null
          THODOA?: string | null
          THOEmployer?: string | null
          THOHearingNo?: string | null
          THOHearingStatus?: string | null
          THOID: number
          THOIRN?: number | null
          THONatureOfAccident?: string | null
          THOProposedAmount?: string | null
          THOReason?: string | null
          THORegion?: string | null
        }
        Update: {
          THOActionOfficer?: string | null
          THOClaimant?: string | null
          THOConfirmedAmount?: string | null
          THODecision?: string | null
          THODOA?: string | null
          THOEmployer?: string | null
          THOHearingNo?: string | null
          THOHearingStatus?: string | null
          THOID?: number
          THOIRN?: number | null
          THONatureOfAccident?: string | null
          THOProposedAmount?: string | null
          THOReason?: string | null
          THORegion?: string | null
        }
        Relationships: []
      }
      tribunalhearingschedule: {
        Row: {
          IRN: number | null
          THSHearingStatus: string | null
          THSHearingType: string | null
          THSID: number
          THSSetForHearing: string | null
          THSSubmissionDate: string | null
          THSWorkerOrganizationType: string | null
        }
        Insert: {
          IRN?: number | null
          THSHearingStatus?: string | null
          THSHearingType?: string | null
          THSID: number
          THSSetForHearing?: string | null
          THSSubmissionDate?: string | null
          THSWorkerOrganizationType?: string | null
        }
        Update: {
          IRN?: number | null
          THSHearingStatus?: string | null
          THSHearingType?: string | null
          THSID?: number
          THSSetForHearing?: string | null
          THSSubmissionDate?: string | null
          THSWorkerOrganizationType?: string | null
        }
        Relationships: []
      }
      tribunalhearingsethearing: {
        Row: {
          THSHClaimantRep1: string | null
          THSHClaimantRep2: string | null
          THSHFromDate: string | null
          THSHHearingNo: string | null
          THSHHearingRef: string | null
          THSHID: string
          THSHLocation: string | null
          THSHObserver1: string | null
          THSHObserver2: string | null
          THSHOfficerAssistTribunal1: string | null
          THSHOfficerAssistTribunal2: string | null
          THSHStateRep1: string | null
          THSHStateRep2: string | null
          THSHStateRep3: string | null
          THSHStatus: string | null
          THSHToDate: string | null
          THSHTribunal1: string | null
          THSHTribunal2: string | null
          THSHTribunal3: string | null
          THSHTribunalChair: string | null
          THSHVenue: string | null
        }
        Insert: {
          THSHClaimantRep1?: string | null
          THSHClaimantRep2?: string | null
          THSHFromDate?: string | null
          THSHHearingNo?: string | null
          THSHHearingRef?: string | null
          THSHID: string
          THSHLocation?: string | null
          THSHObserver1?: string | null
          THSHObserver2?: string | null
          THSHOfficerAssistTribunal1?: string | null
          THSHOfficerAssistTribunal2?: string | null
          THSHStateRep1?: string | null
          THSHStateRep2?: string | null
          THSHStateRep3?: string | null
          THSHStatus?: string | null
          THSHToDate?: string | null
          THSHTribunal1?: string | null
          THSHTribunal2?: string | null
          THSHTribunal3?: string | null
          THSHTribunalChair?: string | null
          THSHVenue?: string | null
        }
        Update: {
          THSHClaimantRep1?: string | null
          THSHClaimantRep2?: string | null
          THSHFromDate?: string | null
          THSHHearingNo?: string | null
          THSHHearingRef?: string | null
          THSHID?: string
          THSHLocation?: string | null
          THSHObserver1?: string | null
          THSHObserver2?: string | null
          THSHOfficerAssistTribunal1?: string | null
          THSHOfficerAssistTribunal2?: string | null
          THSHStateRep1?: string | null
          THSHStateRep2?: string | null
          THSHStateRep3?: string | null
          THSHStatus?: string | null
          THSHToDate?: string | null
          THSHTribunal1?: string | null
          THSHTribunal2?: string | null
          THSHTribunal3?: string | null
          THSHTribunalChair?: string | null
          THSHVenue?: string | null
        }
        Relationships: []
      }
      workerpersonaldetails: {
        Row: {
          SpouseAddress1: string | null
          SpouseAddress2: string | null
          SpouseCity: string | null
          SpouseDOB: string | null
          SpouseEmail: string | null
          SpouseFirstName: string | null
          SpouseLandline: string | null
          SpouseLastName: string | null
          SpouseMobile: string | null
          SpousePlaceOfOriginDistrict: string | null
          SpousePlaceOfOriginProvince: string | null
          SpousePlaceOfOriginVillage: string | null
          SpousePOBox: string | null
          SpouseProvince: string | null
          WorkerAddress1: string | null
          WorkerAddress2: string | null
          WorkerAliasName: string | null
          WorkerCity: string | null
          WorkerDOB: string | null
          WorkerEmail: string | null
          WorkerFirstName: string | null
          WorkerGender: string | null
          WorkerHanded: string | null
          WorkerID: number
          WorkerLandline: string | null
          WorkerLastName: string | null
          WorkerMarried: string | null
          WorkerMobile: string | null
          WorkerPassportPhoto: string | null
          WorkerPlaceOfOriginDistrict: string | null
          WorkerPlaceOfOriginProvince: string | null
          WorkerPlaceOfOriginVillage: string | null
          WorkerPOBox: string | null
          WorkerProvince: string | null
        }
        Insert: {
          SpouseAddress1?: string | null
          SpouseAddress2?: string | null
          SpouseCity?: string | null
          SpouseDOB?: string | null
          SpouseEmail?: string | null
          SpouseFirstName?: string | null
          SpouseLandline?: string | null
          SpouseLastName?: string | null
          SpouseMobile?: string | null
          SpousePlaceOfOriginDistrict?: string | null
          SpousePlaceOfOriginProvince?: string | null
          SpousePlaceOfOriginVillage?: string | null
          SpousePOBox?: string | null
          SpouseProvince?: string | null
          WorkerAddress1?: string | null
          WorkerAddress2?: string | null
          WorkerAliasName?: string | null
          WorkerCity?: string | null
          WorkerDOB?: string | null
          WorkerEmail?: string | null
          WorkerFirstName?: string | null
          WorkerGender?: string | null
          WorkerHanded?: string | null
          WorkerID: number
          WorkerLandline?: string | null
          WorkerLastName?: string | null
          WorkerMarried?: string | null
          WorkerMobile?: string | null
          WorkerPassportPhoto?: string | null
          WorkerPlaceOfOriginDistrict?: string | null
          WorkerPlaceOfOriginProvince?: string | null
          WorkerPlaceOfOriginVillage?: string | null
          WorkerPOBox?: string | null
          WorkerProvince?: string | null
        }
        Update: {
          SpouseAddress1?: string | null
          SpouseAddress2?: string | null
          SpouseCity?: string | null
          SpouseDOB?: string | null
          SpouseEmail?: string | null
          SpouseFirstName?: string | null
          SpouseLandline?: string | null
          SpouseLastName?: string | null
          SpouseMobile?: string | null
          SpousePlaceOfOriginDistrict?: string | null
          SpousePlaceOfOriginProvince?: string | null
          SpousePlaceOfOriginVillage?: string | null
          SpousePOBox?: string | null
          SpouseProvince?: string | null
          WorkerAddress1?: string | null
          WorkerAddress2?: string | null
          WorkerAliasName?: string | null
          WorkerCity?: string | null
          WorkerDOB?: string | null
          WorkerEmail?: string | null
          WorkerFirstName?: string | null
          WorkerGender?: string | null
          WorkerHanded?: string | null
          WorkerID?: number
          WorkerLandline?: string | null
          WorkerLastName?: string | null
          WorkerMarried?: string | null
          WorkerMobile?: string | null
          WorkerPassportPhoto?: string | null
          WorkerPlaceOfOriginDistrict?: string | null
          WorkerPlaceOfOriginProvince?: string | null
          WorkerPlaceOfOriginVillage?: string | null
          WorkerPOBox?: string | null
          WorkerProvince?: string | null
        }
        Relationships: []
      }
      workhistory: {
        Row: {
          OrganizationAddress1: string | null
          OrganizationAddress2: string | null
          OrganizationCity: string | null
          OrganizationCPPSID: string | null
          OrganizationLandline: string | null
          OrganizationName: string | null
          OrganizationPOBox: string | null
          OrganizationProvince: string | null
          WHID: number
          WorkerID: number | null
          WorkerJoiningDate: string | null
          WorkerLeavingDate: string | null
        }
        Insert: {
          OrganizationAddress1?: string | null
          OrganizationAddress2?: string | null
          OrganizationCity?: string | null
          OrganizationCPPSID?: string | null
          OrganizationLandline?: string | null
          OrganizationName?: string | null
          OrganizationPOBox?: string | null
          OrganizationProvince?: string | null
          WHID: number
          WorkerID?: number | null
          WorkerJoiningDate?: string | null
          WorkerLeavingDate?: string | null
        }
        Update: {
          OrganizationAddress1?: string | null
          OrganizationAddress2?: string | null
          OrganizationCity?: string | null
          OrganizationCPPSID?: string | null
          OrganizationLandline?: string | null
          OrganizationName?: string | null
          OrganizationPOBox?: string | null
          OrganizationProvince?: string | null
          WHID?: number
          WorkerID?: number | null
          WorkerJoiningDate?: string | null
          WorkerLeavingDate?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_mapping: {
        Row: {
          auth_user_id: string | null
          email: string | null
          name: string | null
          owc_user_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
