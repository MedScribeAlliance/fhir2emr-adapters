
## Push data to EKA EMR using adapter

- Use adapter: to convert FHIR to Eka EMR format
OR use hosted Adapter
```
 curl -X POST https://eka-emr-adapter-production.up.railway.app/convert -H "Content-Type: application/json" -d '{"resourceType":"Bundle","type":"collection","entry":[{"resource":{"resourceType":"Condition","code":{"text":"Hypertension"},"category":[{"coding":[{"code":"encounter-diagnosis"}]}],"clinicalStatus":{"coding":[{"code":"active"}]}}}]}'
 ```
- pass the output of adapter to inside `tool`, sample below
- Create a patient appointment, using https://developer.eka.care/api-reference/doc-tool/appointment-api/book-appointment-slot
- Get `auth` header from https://console.eka.care/api-keys/ (Generate long lived token) 


```
curl 'https://parchi.eka.care/app/push/px-draft/?flavour=dw' \
  -X POST \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -b 'auth: <auth_token>' \
  --data-raw '{
    "data": {
      "id": "<uuid>",
      "visitId": "<visitId>",
      "tool": {
        "language": "EN",
        "symptoms": [
          {
            "name": "Headache",
            "id": "s-3938038535",
            "properties": {
              "pg-2869689919": {
                "name": "Severity",
                "selection": [{ "value": "Moderate" }]
              },
              "pg-laterality": {
                "name": "Laterality",
                "selection": [{ "value": "Right" }]
              },
              "pg-1541659976": {
                "name": "Since",
                "selection": [{ "value": "3", "unit": "Days" }]
              }
            }
          }
        ],
        "diagnosis": [
          {
            "name": "Type 2 diabetes",
            "properties": {
              "pg-002": {
                "name": "Current status",
                "selection": [{ "value": "Active" }]
              },
              "pg-severity": {
                "name": "Severity",
                "selection": [{ "value": "Mild" }]
              }
            }
          }
        ],
        "labTests": [
          { "name": "CBC test", "book": false },
          { "name": "Fasting blood sugar test", "book": false }
        ]
      }
    }
  }'
```