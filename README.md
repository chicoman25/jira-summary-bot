# Jira Summary Bot

A Python-based tool that fetches Jira tickets and generates AI-powered summaries using OpenAI's API.

## Features

- Fetches Jira tickets based on specified project keys
- Generates AI-powered summaries of Jira tickets
- Saves summaries to files in the `summaries` directory
- Configurable through environment variables

## Prerequisites

- Python 3.x
- Jira account with API access
- OpenAI API key
- Virtual environment (recommended)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd jira-summary-bot
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root with the following variables:
```env
JIRA_BASE_URL=your_jira_base_url
JIRA_EMAIL=your_jira_email
JIRA_API_TOKEN=your_jira_api_token
OPENAI_API_KEY=your_openai_api_key
JIRA_PROJECT_KEYS=your_project_keys  # Comma-separated list of project keys
```

### Obtaining API Keys

1. **Jira API Token**:
   - Log in to your Atlassian account
   - Go to Account Settings > Security > API tokens
   - Create a new API token
   - Copy the token to your `.env` file

2. **OpenAI API Key**:
   - Sign up for an OpenAI account at https://platform.openai.com
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key to your `.env` file

## Usage

1. Make sure your virtual environment is activated
2. Run the main script:
```bash
python main.py
```

The script will:
- Connect to Jira using your credentials
- Fetch tickets from the specified projects
- Generate summaries using OpenAI's API
- Save the summaries to the `summaries` directory

## Project Structure


## Output

Summaries are saved in the `summaries` directory, with one file per project. Each summary includes:
- Ticket key
- Summary
- Original description
- Status
- Other relevant metadata

## Error Handling

The application includes error handling for:
- API connection issues
- Invalid credentials
- Rate limiting
- File system operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here] 