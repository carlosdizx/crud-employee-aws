aws s3 mb s3://employees --region us-east-1 --endpoint-url http://localhost:4566
aws dynamodb create-table --cli-input-json file://employees.json --endpoint-url http://localhost:4566

