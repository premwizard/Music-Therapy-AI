from pathlib import Path
from dotenv import load_dotenv

# Load backend .env before any utils submodules access environment values.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')
