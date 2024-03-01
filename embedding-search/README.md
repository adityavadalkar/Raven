## How to start

**Step #1** - create virtual environment using python3 and activate it (keep it outside our project directory)

```bash
virtualenv env
source env/bin/activate
```

<br />

**Step #3** - Install dependencies in virtualenv

```bash
pip install -r requirements.txt
```

<br />

**Step #4** - setup `flask` command for our app

```bash
export FLASK_APP=run.py
export FLASK_ENV=development
```

<br />

**Step #5** - Create a new `.env` file using sample `env.sample`

```bash
cp env.sample .env
```

<br />

**Step #6** - start test APIs server at `localhost:5005`

```bash
flask run
```

<br />

## Testing

Run tests using `pytest tests.py`
