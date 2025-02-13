# API Documentation

## Authentication
All API endpoints require authentication using a JWT token.

### Headers
```
Authorization: Bearer <token>
```

## Endpoints

### Ideas

#### GET /api/ideas
Retrieve a list of ideas.

Query Parameters:
- `status`: Filter by idea status
- `sort`: Sort order (created_at, status)
- `limit`: Number of results (default: 10)

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": "draft | in_progress | completed",
      "created_at": "timestamp"
    }
  ]
}
```

#### POST /api/ideas
Create a new idea.

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "status": "draft"
}
```

### Analytics

#### GET /api/analytics
Retrieve analytics data.

Query Parameters:
- `dateRange`: Time period (7D, 30D, 90D, YTD)

Response:
```json
{
  "totalIdeas": "number",
  "inProgressIdeas": "number",
  "completedIdeas": "number",
  "statusBreakdown": [
    {
      "name": "string",
      "value": "number"
    }
  ]
}
```

## Error Handling
All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error