Open EKA EMR https://dr.eka.care/?version=33.33.33-beta&showversion=true

and push data

```
window.dispatchEvent(
  new CustomEvent("scribe-protocol-data", {
    detail: {
      value: {
  "resourceType": "Bundle",
  "id": "93c42e7d-53d9-4423-9298-729b4d9b777d",
  "type": "collection",
  "timestamp": "2026-01-27T12:30:42.149798Z",
  "entry": [
    {
      "fullUrl": "urn:uuid:cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
      "resource": {
        "resourceType": "Patient",
        "id": "cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://nrces.in/ndhm/fhir/r5/CodeSystem/ndhm-identifier-type-code",
                  "code": "ABHA",
                  "display": "ABHA"
                }
              ]
            },
            "value": "ABHA-1234567890"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "MR",
                  "display": "MR"
                }
              ]
            },
            "value": "MRN-001234"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "PHONE",
                  "display": "PHONE"
                }
              ]
            },
            "value": "9876543210"
          }
        ],
        "name": [
          {
            "text": "Rahul Sharma",
            "family": "Sharma",
            "given": ["Rahul"]
          }
        ],
        "telecom": [
          {
            "system": "phone",
            "value": "9876543210",
            "use": "mobile"
          },
          {
            "system": "email",
            "value": "rahul.sharma@email.com"
          }
        ],
        "gender": "male",
        "birthDate": "1996-01-27",
        "address": [
          {
            "text": "123 Main Street, Koramangala, Bangalore, Karnataka 560034",
            "line": [
              "123 Main Street, Koramangala, Bangalore, Karnataka 560034"
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:c4e949e7-b80e-4c44-b15c-fb765d735ff2",
      "resource": {
        "resourceType": "Encounter",
        "id": "c4e949e7-b80e-4c44-b15c-fb765d735ff2",
        "status": "finished",
        "class": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": "AMB",
                "display": "ambulatory"
              }
            ]
          }
        ],
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/encounter-type",
                "code": "consultation",
                "display": "Consultation"
              }
            ],
            "text": "Consultation"
          }
        ],
        "serviceType": [
          {
            "concept": {
              "text": "General Medicine"
            }
          }
        ],
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "serviceProvider": {
          "display": "Apollo Hospital"
        },
        "actualPeriod": {
          "start": "2026-01-27T18:00:42.146956+05:30"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:c09d2a1e-1de8-4cfc-ad03-bf5e1a17c4ca",
      "resource": {
        "resourceType": "Observation",
        "id": "c09d2a1e-1de8-4cfc-ad03-bf5e1a17c4ca",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "symptom",
                "display": "Symptom"
              }
            ],
            "text": "symptom"
          }
        ],
        "code": {
          "text": "Headache"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "effectiveDateTime": "2026-01-26T18:00:42.147218+05:30",
        "note": [
          {
            "text": "Higher in the morning and decreases towards the evening"
          }
        ],
        "component": [
          {
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "246112005",
                  "display": "Severity"
                }
              ]
            },
            "valueCodeableConcept": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "6736007",
                  "display": "Moderate"
                }
              ],
              "text": "Moderate"
            }
          },
          {
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "272741003",
                  "display": "Laterality"
                }
              ]
            },
            "valueCodeableConcept": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "24028007",
                  "display": "Right"
                }
              ],
              "text": "Right"
            }
          },
          {
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "408729009",
                  "display": "Finding context"
                }
              ]
            },
            "valueCodeableConcept": {
              "text": "Present"
            }
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:531a2f33-caf4-4f8f-b72f-e93949e370c9",
      "resource": {
        "resourceType": "Observation",
        "id": "531a2f33-caf4-4f8f-b72f-e93949e370c9",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "symptom",
                "display": "Symptom"
              }
            ],
            "text": "symptom"
          }
        ],
        "code": {
          "text": "Leg pain"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "component": [
          {
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "408729009",
                  "display": "Finding context"
                }
              ]
            },
            "valueCodeableConcept": {
              "text": "Absent"
            }
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:e08f687c-8ce4-4993-b7bc-56e839c38825",
      "resource": {
        "resourceType": "Observation",
        "id": "e08f687c-8ce4-4993-b7bc-56e839c38825",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "code": {
          "text": "Blood Pressure"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueString": "120/80",
        "interpretation": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                "code": "N",
                "display": "Normal"
              }
            ],
            "text": "Normal"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:f1a2bfea-a4b0-4ec5-9f29-001a0913fdef",
      "resource": {
        "resourceType": "Observation",
        "id": "f1a2bfea-a4b0-4ec5-9f29-001a0913fdef",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "laboratory",
                "display": "Laboratory"
              }
            ]
          }
        ],
        "code": {
          "text": "Hemoglobin"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueQuantity": {
          "value": 12,
          "unit": "percent",
          "system": "http://unitsofmeasure.org",
          "code": "percent"
        },
        "interpretation": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                "code": "N",
                "display": "Normal"
              }
            ],
            "text": "Normal"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:78268e13-797d-420f-9008-6cee6bfe10fe",
      "resource": {
        "resourceType": "Observation",
        "id": "78268e13-797d-420f-9008-6cee6bfe10fe",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "laboratory",
                "display": "Laboratory"
              }
            ]
          }
        ],
        "code": {
          "text": "PCM test"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "interpretation": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                "code": "N",
                "display": "Normal"
              }
            ],
            "text": "Normal"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:e2c978fe-90f0-4995-93e5-06118e962c6f",
      "resource": {
        "resourceType": "Observation",
        "id": "e2c978fe-90f0-4995-93e5-06118e962c6f",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "social-history",
                "display": "Social History"
              }
            ]
          }
        ],
        "code": {
          "text": "Smoking"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueString": "Active"
      }
    },
    {
      "fullUrl": "urn:uuid:c2120163-a391-4368-b29b-c21aef24368b",
      "resource": {
        "resourceType": "Observation",
        "id": "c2120163-a391-4368-b29b-c21aef24368b",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "social-history",
                "display": "Social History"
              }
            ]
          }
        ],
        "code": {
          "text": "Drinking"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueString": "Active",
        "note": [
          {
            "text": "Occasional drinker"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:c13ee9d2-c473-4e37-b30a-94640e5ee0dc",
      "resource": {
        "resourceType": "Observation",
        "id": "c13ee9d2-c473-4e37-b30a-94640e5ee0dc",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "social-history",
                "display": "Social History"
              }
            ]
          }
        ],
        "code": {
          "text": "Traveled to Singapore"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueString": "Active",
        "note": [
          {
            "text": "Came back a couple of weeks ago"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:0c9ffdc8-9ac7-4d34-b6bb-482a68c8a563",
      "resource": {
        "resourceType": "Observation",
        "id": "0c9ffdc8-9ac7-4d34-b6bb-482a68c8a563",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "exam",
                "display": "Exam"
              }
            ]
          }
        ],
        "code": {
          "text": "Hand examination"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "valueString": "Swollen"
      }
    },
    {
      "fullUrl": "urn:uuid:97a1e18e-b36f-4162-ab11-0dd4b8e5e4d9",
      "resource": {
        "resourceType": "Condition",
        "id": "97a1e18e-b36f-4162-ab11-0dd4b8e5e4d9",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "verificationStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              "code": "confirmed",
              "display": "Confirmed"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "encounter-diagnosis",
                "display": "Encounter Diagnosis"
              }
            ]
          }
        ],
        "severity": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "255604002",
              "display": "Mild"
            }
          ],
          "text": "Mild"
        },
        "code": {
          "text": "Type 2 diabetes"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "onsetDateTime": "2026-01-24T18:00:42.147494+05:30"
      }
    },
    {
      "fullUrl": "urn:uuid:c2136527-447a-455e-9d04-6b5e08112c29",
      "resource": {
        "resourceType": "Condition",
        "id": "c2136527-447a-455e-9d04-6b5e08112c29",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "verificationStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              "code": "confirmed",
              "display": "Confirmed"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "encounter-diagnosis",
                "display": "Encounter Diagnosis"
              }
            ]
          }
        ],
        "severity": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "255604002",
              "display": "Mild"
            }
          ],
          "text": "Mild"
        },
        "code": {
          "text": "Cardiac condition"
        },
        "bodySite": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "7771000",
                "display": "Left"
              }
            ],
            "text": "Left"
          }
        ],
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "note": [
          {
            "text": "On the left portion"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:021918d6-c5e9-4f50-95b5-82b9a495a728",
      "resource": {
        "resourceType": "Condition",
        "id": "021918d6-c5e9-4f50-95b5-82b9a495a728",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "problem-list-item",
                "display": "Problem List Item"
              }
            ]
          }
        ],
        "code": {
          "text": "Hypertension"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "onsetDateTime": "2020-01-01",
        "note": [
          {
            "text": "Very severe"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:10c4c146-be5a-4809-a9ee-29d6a8244ed5",
      "resource": {
        "resourceType": "MedicationRequest",
        "id": "10c4c146-be5a-4809-a9ee-29d6a8244ed5",
        "status": "active",
        "intent": "order",
        "medication": {
          "concept": {
            "text": "Dolo 650 Tablet"
          }
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "note": [
          {
            "text": "Dose: 1 tablet"
          }
        ],
        "dosageInstruction": [
          {
            "text": "Take 1 tablet three times daily after meals",
            "timing": {
              "repeat": {
                "frequency": 3,
                "period": 1,
                "periodUnit": "d",
                "when": ["PC"]
              }
            },
            "asNeeded": false,
            "route": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "26643006",
                  "display": "Oral"
                }
              ],
              "text": "Oral"
            },
            "doseAndRate": [
              {
                "doseQuantity": {
                  "value": 1,
                  "unit": "tablet",
                  "system": "http://unitsofmeasure.org",
                  "code": "tablet"
                }
              }
            ]
          }
        ],
        "dispenseRequest": {
          "expectedSupplyDuration": {
            "value": 7,
            "unit": "d",
            "system": "http://unitsofmeasure.org",
            "code": "d"
          }
        }
      }
    },
    {
      "fullUrl": "urn:uuid:2443a349-eabe-441f-b605-4c51feaa1aa6",
      "resource": {
        "resourceType": "MedicationStatement",
        "id": "2443a349-eabe-441f-b605-4c51feaa1aa6",
        "status": "active",
        "medication": {
          "concept": {
            "text": "Crocin 600"
          }
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "effectiveDateTime": "2025-10-29T18:00:42.147993+05:30",
        "note": [
          {
            "text": "Every week once"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:6d85cff0-235b-4f27-9cda-ba81fe7e8053",
      "resource": {
        "resourceType": "ServiceRequest",
        "id": "6d85cff0-235b-4f27-9cda-ba81fe7e8053",
        "status": "active",
        "intent": "order",
        "category": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "108252007",
                "display": "Laboratory procedure"
              }
            ]
          }
        ],
        "code": {
          "concept": {
            "text": "CBC test"
          }
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:c9427fee-81c9-4f29-99f1-0d8cd2f8238f",
      "resource": {
        "resourceType": "ServiceRequest",
        "id": "c9427fee-81c9-4f29-99f1-0d8cd2f8238f",
        "status": "active",
        "intent": "order",
        "category": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "108252007",
                "display": "Laboratory procedure"
              }
            ]
          }
        ],
        "code": {
          "concept": {
            "text": "Fasting blood sugar test"
          }
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "note": [
          {
            "text": "Should be done on empty stomach"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:873726c1-2e4c-44eb-9cf4-6e87bced8d86",
      "resource": {
        "resourceType": "Procedure",
        "id": "873726c1-2e4c-44eb-9cf4-6e87bced8d86",
        "status": "completed",
        "code": {
          "text": "Vasectomy"
        },
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:c04d80e6-2970-4b45-b767-8679fb762506",
      "resource": {
        "resourceType": "FamilyMemberHistory",
        "id": "c04d80e6-2970-4b45-b767-8679fb762506",
        "status": "completed",
        "patient": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "relationship": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
              "code": "FTH",
              "display": "father"
            }
          ],
          "text": "father"
        },
        "condition": [
          {
            "code": {
              "text": "Hypertension"
            },
            "onsetString": "1997"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:23ef4e12-5479-4949-9fa4-a3436cc4f06d",
      "resource": {
        "resourceType": "FamilyMemberHistory",
        "id": "23ef4e12-5479-4949-9fa4-a3436cc4f06d",
        "status": "completed",
        "patient": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "relationship": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
              "code": "MTH",
              "display": "mother"
            }
          ],
          "text": "mother"
        },
        "deceasedBoolean": true,
        "note": [
          {
            "text": "Mother is dead now"
          }
        ],
        "condition": [
          {
            "code": {
              "text": "Type 2 diabetes"
            },
            "note": [
              {
                "text": "Mother is dead now"
              }
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:0a6f82ff-f3f4-4a3f-be0e-fd66d7862130",
      "resource": {
        "resourceType": "AllergyIntolerance",
        "id": "0a6f82ff-f3f4-4a3f-be0e-fd66d7862130",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "category": ["environment"],
        "code": {
          "text": "Pollen allergy"
        },
        "patient": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:4d6c1ad7-8291-40ab-83fe-6e01b1d99c65",
      "resource": {
        "resourceType": "AllergyIntolerance",
        "id": "4d6c1ad7-8291-40ab-83fe-6e01b1d99c65",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "category": ["medication"],
        "code": {
          "text": "Paracetamol"
        },
        "patient": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:b5a06734-522b-482f-81dc-06e745728fa1",
      "resource": {
        "resourceType": "Immunization",
        "id": "b5a06734-522b-482f-81dc-06e745728fa1",
        "status": "completed",
        "vaccineCode": {
          "text": "COVID vaccine"
        },
        "patient": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "occurrenceString": "Unknown",
        "note": [
          {
            "text": "Done during the second wave of COVID"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:8934fd7b-aba3-4c8e-8a26-5beafb7bfc91",
      "resource": {
        "resourceType": "Appointment",
        "id": "8934fd7b-aba3-4c8e-8a26-5beafb7bfc91",
        "status": "booked",
        "serviceType": [
          {
            "concept": {
              "text": "Follow-up"
            }
          }
        ],
        "start": "2025-05-21T00:00:00",
        "note": [
          {
            "text": "Come with empty stomach"
          }
        ],
        "participant": [
          {
            "actor": {
              "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
              "display": "Rahul Sharma"
            },
            "status": "accepted"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:d7ac49e6-1f2d-4cc4-a7a8-12aed18a56a2",
      "resource": {
        "resourceType": "CarePlan",
        "id": "d7ac49e6-1f2d-4cc4-a7a8-12aed18a56a2",
        "status": "active",
        "intent": "plan",
        "description": "Drink plenty of water",
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "activity": [
          {
            "progress": [
              {
                "text": "Drink plenty of water"
              }
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:069fd408-27db-4b55-a633-b900353cc016",
      "resource": {
        "resourceType": "CarePlan",
        "id": "069fd408-27db-4b55-a633-b900353cc016",
        "status": "active",
        "intent": "plan",
        "description": "Do not go out in sun",
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "activity": [
          {
            "progress": [
              {
                "text": "Do not go out in sun"
              }
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:51b22a87-0247-481c-8c30-c6ec726fa662",
      "resource": {
        "resourceType": "CarePlan",
        "id": "51b22a87-0247-481c-8c30-c6ec726fa662",
        "status": "active",
        "intent": "plan",
        "description": "Do not eat oily food",
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "activity": [
          {
            "progress": [
              {
                "text": "Do not eat oily food"
              }
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:c36a0bb2-ceba-4dc0-b74b-a6ffbf37bfa3",
      "resource": {
        "resourceType": "Communication",
        "id": "c36a0bb2-ceba-4dc0-b74b-a6ffbf37bfa3",
        "status": "completed",
        "category": [
          {
            "text": "prescription-note"
          }
        ],
        "subject": {
          "reference": "Patient/cb964485-33dc-4f91-a4e2-43e7e1cb6a16",
          "display": "Rahul Sharma"
        },
        "encounter": {
          "reference": "Encounter/c4e949e7-b80e-4c44-b15c-fb765d735ff2"
        },
        "payload": [
          {
            "contentCodeableConcept": {
              "text": "Patient is a 30 year old living in Bangalore"
            }
          }
        ]
      }
    }
  ]
}

    },
  })
);
```
