
## Push data to EKA EMR using adapter

- Use adapter: to convert FHIR to Eka EMR format
- pass the output of adapter to inside `tool`, sample below
- Create a patient appointment, using https://developer.eka.care/api-reference/doc-tool/appointment-api/book-appointment-slot


```
curl 'https://parchi.eka.care/app/push/px-draft/?flavour=dw' \
  -X POST \
  -H 'accept: application/json' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'activeid: 161467756044203' \
  -H 'mactiveid: 161467756044203' \
  -H 'content-type: application/json' \
  -H 'origin: https://dr.eka.care' \
  -H 'referer: https://dr.eka.care/' \
  -H 'time-zone: Asia/Calcutta' \
  -H 'priority: u=1, i' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-ch-ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36' \
  -b '_ga=GA1.1.1259910372.1767941909; _hjSessionUser_2344911=...; sess=...; refresh=...' \
  --data-raw '{
    "data": {
      "id": "<uuid>",
      "visitId": "d-5d39f105-9e30-4842-821f-80a8cba133c0",
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