import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
from pathlib import Path

# DATA ROOT auto-detected relative to this file
HERE = Path(__file__).resolve().parent
DATA_ROOT = HERE / "Stocks_New"

# --- NEW: Sector Mapping ---
# This dictionary maps each sector name to a list of stock tickers
# It's created based on the folder structure you provided.
SECTORS_DATA = {
    "Automobile": ["BAJAJ-AUTO", "EICHERMOT", "HEROMOTOCO", "MARUTI", "TATAMOTORS"],
    "Consumer Goods": ["BRITANNIA", "GODREJCP", "HINDUNILVR", "ITC", "NESTLEIND"],
    "Defence": ["BDL", "BEL", "DATAPATTNS", "HAL", "PARAS"],
    "Finance": ["AXISBANK", "HDFCBANK", "ICICIBANK", "KOTAKBANK", "SBIN"],
    "Healthcare": ["APOLLOHOSP", "CIPLA", "DIVISLAB", "DRREDDY", "SUNPHARMA"],
    "Oil & Gas": ["BPCL", "GAIL", "IOC", "ONGC", "RELIANCE"],
    "Technology": ["HCLTECH", "INFY", "LTIM", "TCS", "WIPRO"],
    "Telecom": ["HFCL", "IDEA", "INDUSTOWER", "TATACOMM", "TTML"]
}

# This will be our in-memory DataFrame containing all data
df_stocks = None

# A global watchlist, just like in your original code
watchlist = []

def load_historical_data():
    """
    Loads and combines historical stock data exclusively from the new sector-based folders.
    """
    # Create a list of all file paths to be loaded from the 'Stocks_New' directory
    all_file_paths = []
    
    # Add files from the 'Stocks_New' sector folders
    for sector, tickers in SECTORS_DATA.items():
        for ticker in tickers:
            # Construct the file path for the new historical data files
            file_path = str(DATA_ROOT / sector / f"{ticker}_history.csv")
            all_file_paths.append(file_path)

    all_data = []
    print("🔍 Loading data exclusively from the 'Stocks_New' dataset...")
    
    for file_path in all_file_paths:
        try:
            # The ticker is derived from the filename
            ticker = os.path.basename(file_path).replace('.csv', '').replace('_history', '').upper()
            
            # Read the CSV file
            df = pd.read_csv(file_path)
            
            # Clean and preprocess the data
            df['Date'] = pd.to_datetime(df['Date'])
            df.set_index('Date', inplace=True)
            
            # Keep only the 'Close' column and rename it to the ticker
            df = df[['Close']].copy()
            df.rename(columns={'Close': ticker}, inplace=True)
            all_data.append(df)
            
            print(f"✅ Loaded data for {ticker}.")

        except FileNotFoundError:
            print(f"❌ Error: File '{file_path}' not found. Please check your folder structure and file names.")
            continue
        except Exception as e:
            print(f"❌ Error processing file {file_path}: {e}")
            continue

    if not all_data:
        print("❌ No data could be loaded. Please ensure the files are in the correct directory.")
        return None
    
    # Concatenate all dataframes into a single one along the columns (axis=1)
    df_combined = pd.concat(all_data, axis=1, ignore_index=False)
    
    # Filter for the last 5 years as per the project scope
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5 * 365)
    df_filtered = df_combined.loc[start_date:end_date]
    
    print(f"✅ Combined data for {len(df_filtered.columns)} stocks from {df_filtered.index.min().date()} to {df_filtered.index.max().date()}.")
    return df_filtered

def get_stock_data(tickers):
    """
    Extracts latest and historical data for a list of tickers from the loaded DataFrame.
    Returns:
        - stock_data (dict): Latest closing price for each ticker.
        - past_data (DataFrame): Historical closing prices for each ticker.
    """
    if df_stocks is None:
        print("⚠️ Data has not been loaded. Please load the dataset first.")
        return {}, pd.DataFrame()
        
    stock_data = {}
    past_data = df_stocks[tickers]

    for ticker in tickers:
        # Check if the ticker exists in the DataFrame
        if ticker not in df_stocks.columns:
            print(f"⚠️ Warning: Ticker '{ticker}' not found in the dataset.")
            continue
        
        # Get the latest day's data
        latest_close = df_stocks[ticker].iloc[-1]
        stock_data[ticker] = {
            "Close": round(latest_close, 2)
        }

    return stock_data, past_data

def add_to_watchlist(ticker):
    """Add a stock ticker to the watchlist."""
    if df_stocks is None or ticker not in df_stocks.columns:
        print(f"❌ Ticker '{ticker}' not in dataset.")
        return
        
    if ticker not in watchlist:
        watchlist.append(ticker)
        print(f"✅ {ticker} added to watchlist.")
    else:
        print(f"ℹ️ {ticker} is already in the watchlist.")

def show_watchlist():
    """Display the watchlist stocks with historical data."""
    if not watchlist:
        print("ℹ️ Watchlist is empty.")
        return
    
    if df_stocks is None:
        print("⚠️ Data has not been loaded.")
        return
    
    print("📈 Watchlist stocks:")
    for ticker in watchlist:
        if ticker in df_stocks.columns:
            latest_price = df_stocks[ticker].iloc[-1]
            print(f"  - {ticker}: ₹{latest_price:.2f}")
        else:
            print(f"  - {ticker}: Data not available")
    
    # Note: Graphical display requires matplotlib which is not installed
    print("Note: Install matplotlib for graphical display")

# --- MPT Algorithm Implementation ---
def run_mpt_simulation(past_data, num_portfolios=50000):
    """
    Performs a Monte Carlo simulation for Modern Portfolio Theory.
    """
    # Calculate daily returns
    returns = past_data.pct_change().dropna()
    mean_daily_returns = returns.mean()
    cov_matrix = returns.cov()
    
    # Store results of the simulation
    portfolio_returns = []
    portfolio_volatilities = []
    sharpe_ratios = []
    portfolio_weights = []

    # Get number of assets
    num_assets = len(past_data.columns)

    # Calculate annualized factors
    annualizing_factor = 252 # Number of trading days in a year

    for _ in range(num_portfolios):
        # Generate random weights for assets
        weights = np.random.random(num_assets)
        weights /= np.sum(weights)
        
        # Calculate expected annual return, volatility, and Sharpe ratio
        annual_return = np.sum(mean_daily_returns * weights) * annualizing_factor
        annual_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights))) * np.sqrt(annualizing_factor)
        sharpe_ratio = annual_return / annual_volatility # Assuming a risk-free rate of 0
        
        portfolio_returns.append(annual_return)
        portfolio_volatilities.append(annual_volatility)
        sharpe_ratios.append(sharpe_ratio)
        portfolio_weights.append(weights)

    # Convert to numpy arrays
    portfolio_returns = np.array(portfolio_returns)
    portfolio_volatilities = np.array(portfolio_volatilities)
    
    # Find the optimal portfolio (highest Sharpe ratio)
    max_sharpe_idx = np.argmax(sharpe_ratios)
    optimal_portfolio_weights = portfolio_weights[max_sharpe_idx]
    
    # Find the minimum volatility portfolio
    min_vol_idx = np.argmin(portfolio_volatilities)
    min_vol_portfolio_weights = portfolio_weights[min_vol_idx]

    return {
        'returns': portfolio_returns,
        'volatilities': portfolio_volatilities,
        'sharpe_ratios': sharpe_ratios,
        'weights': portfolio_weights,
        'tickers': past_data.columns,
        'optimal': {
            'weights': optimal_portfolio_weights,
            'return': portfolio_returns[max_sharpe_idx],
            'volatility': portfolio_volatilities[max_sharpe_idx],
            'sharpe': sharpe_ratios[max_sharpe_idx]
        },
        'min_vol': {
            'weights': min_vol_portfolio_weights,
            'return': portfolio_returns[min_vol_idx],
            'volatility': portfolio_volatilities[min_vol_idx]
        }
    }

def display_recommendations(investment_amount, risk_tolerance, mpt_results):
    """
    Helper function to display the MPT recommendations based on the results.
    """
    optimal_portfolio = mpt_results['optimal']
    min_vol_portfolio = mpt_results['min_vol']
    tickers = mpt_results['tickers']
    
    # Decide which portfolio to recommend based on risk tolerance
    if risk_tolerance == 'low':
        chosen_portfolio = min_vol_portfolio
        portfolio_type = "Minimum Volatility"
    elif risk_tolerance in ['medium', 'high']:
        chosen_portfolio = optimal_portfolio
        portfolio_type = "Optimal Sharpe Ratio"
    else:
        print("⚠️ Invalid risk tolerance. Defaulting to a Balanced/Optimal portfolio.")
        chosen_portfolio = optimal_portfolio
        portfolio_type = "Optimal Sharpe Ratio"

    print(f"\n✅ Recommendation for a {risk_tolerance} risk investor ({portfolio_type} Portfolio):")
    print(f"  - Expected Annual Return: {chosen_portfolio['return']:.2%}")
    print(f"  - Predicted Annual Volatility: {chosen_portfolio['volatility']:.2%}")
    
    print("\n  Recommended Allocation:")
    total_allocated_amount = 0
    for i, weight in enumerate(chosen_portfolio['weights']):
        if weight > 0.01: # Only show assets with significant allocation (> 1%)
            rupee_allocation = investment_amount * weight
            total_allocated_amount += rupee_allocation
            print(f"    - {tickers[i]}: {weight:.2%} (₹{rupee_allocation:.2f})")
    
    print(f"\nTotal Allocated Amount: ₹{total_allocated_amount:.2f}")

# --- NEW: Function to get recommendations by sector ---
def get_recommendations_by_sector():
    """
    Guides the user to select sectors and get MPT recommendations on them.
    """
    if df_stocks is None or df_stocks.empty:
        print("❌ Data is not loaded or is empty. Cannot proceed.")
        return

    print("\n📦 Available Sectors:")
    sectors = list(SECTORS_DATA.keys())
    for i, sector in enumerate(sectors):
        print(f"  {i+1}. {sector}")
    
    # Get user input for multiple sectors
    user_input = input("Enter the numbers of the sectors you want to analyze (e.g., '1, 3, 5'): ")
    try:
        selected_indices = [int(i.strip()) for i in user_input.split(',')]
        
        # Get the tickers for the selected sectors
        selected_tickers = []
        for index in selected_indices:
            if 0 < index <= len(sectors):
                sector_name = sectors[index-1]
                selected_tickers.extend(SECTORS_DATA[sector_name])
            else:
                print(f"⚠️ Warning: Invalid sector number '{index}' was ignored.")

        if not selected_tickers:
            print("❌ No valid sectors were selected. Please try again.")
            return

        print(f"\n✅ Selected stocks for analysis: {', '.join(selected_tickers)}")
        
        # Filter the main DataFrame to include only the selected tickers
        # Handle cases where a selected ticker might have missing data
        filtered_df = df_stocks[selected_tickers].dropna(axis=1)

        if filtered_df.empty:
            print("❌ The selected stocks have no common historical data for the analysis period. Please select different stocks.")
            return

        # Now, get the investment details and run the MPT simulation on the filtered data
        amount = float(input("Enter your investment amount (in ₹): "))
        risk = input("Enter your risk tolerance (low, medium, high): ").strip().lower()

        # Run the MPT simulation with the filtered DataFrame
        mpt_results = run_mpt_simulation(filtered_df)
        
        # Call a new, modified get_recommendations to display the results
        display_recommendations(amount, risk, mpt_results)

    except (ValueError, IndexError):
        print("❌ Invalid input. Please enter numbers separated by commas.")

# Main function to run the CLI menu with new features
def main():
    global df_stocks
    
    # The list of files to be loaded now also includes the new sector files
    df_stocks = load_historical_data()

    if df_stocks is None:
        return # Exit if data loading failed

    while True:
        print("\n🔹 Options:")
        print("1️⃣ View all available stocks")
        print("2️⃣ Add stock to watchlist")
        print("3️⃣ Show watchlist (historical trend)")
        print("4️⃣ Get portfolio recommendation for a specific set of stocks")
        print("5️⃣ Get portfolio recommendation by sector")
        print("6️⃣ Exit")
        choice = input("Enter your choice: ").strip()

        if choice == "1":
            print("\n📊 Available Stocks:", ", ".join(df_stocks.columns))

        elif choice == "2":
            ticker = input("Enter stock ticker to add to watchlist: ").strip().upper()
            add_to_watchlist(ticker)

        elif choice == "3":
            show_watchlist()

        elif choice == "4":
            try:
                # This option is for a specific set of stocks selected manually
                tickers_str = input("Enter stock tickers to analyze (e.g., 'CIPLA, AXISBANK, WIPRO'): ")
                tickers_to_analyze = [ticker.strip().upper() for ticker in tickers_str.split(',')]
                
                # Filter the main DataFrame for the selected tickers
                df_stocks_clean = df_stocks[tickers_to_analyze].dropna(axis=1)

                if df_stocks_clean.empty:
                    print("❌ Not enough data for the selected stocks to run the MPT algorithm. All stocks have missing data points.")
                    continue
                
                amount = float(input("Enter your investment amount (in ₹): "))
                risk = input("Enter your risk tolerance (low, medium, high): ").strip().lower()
                
                mpt_results = run_mpt_simulation(df_stocks_clean)
                display_recommendations(amount, risk, mpt_results)

            except ValueError:
                print("❌ Invalid input. Please enter valid stock tickers and a number for the amount.")
        
        elif choice == "5":
            get_recommendations_by_sector()

        elif choice == "6":
            print("👋 Exiting...")
            break

        else:
            print("❌ Invalid choice. Please try again.")

# --- API Functions for FastAPI Integration ---

def load_all_sector_data():
    """Load all stock data into the global df_stocks variable."""
    global df_stocks
    if df_stocks is None:
        df_stocks = load_historical_data()

def get_dataset_summary():
    """Get a summary of the loaded dataset."""
    if df_stocks is None:
        return {"error": "Data not loaded"}
    
    return {
        "total_stocks": len(df_stocks.columns),
        "date_range": {
            "start": df_stocks.index.min().isoformat() if not df_stocks.empty else None,
            "end": df_stocks.index.max().isoformat() if not df_stocks.empty else None
        },
        "sectors": list(SECTORS_DATA.keys())
    }

def get_recommendations_for_tickers(tickers, amount):
    """
    Get MPT recommendations for specific tickers.
    Returns allocation, latest prices, and historical data.
    """
    if df_stocks is None:
        raise ValueError("Data not loaded")
    
    # Filter for available tickers
    available_tickers = [t for t in tickers if t in df_stocks.columns]
    if not available_tickers:
        raise ValueError("None of the requested tickers are available in the dataset")
    
    # Get stock data
    stock_data, past_data = get_stock_data(available_tickers)
    
    # Run MPT simulation
    mpt_results = run_mpt_simulation(past_data)
    
    # Use optimal portfolio (can be modified based on risk preference)
    optimal_weights = mpt_results['optimal']['weights']
    
    # Create allocation dictionary
    allocation = {}
    for i, ticker in enumerate(available_tickers):
        weight = optimal_weights[i]
        if weight > 0.01:  # Only include significant allocations
            allocation[ticker] = {
                "weight": float(weight),
                "amount": float(amount * weight)
            }
    
    # Get latest prices
    latest_prices = {ticker: float(df_stocks[ticker].iloc[-1]) for ticker in available_tickers}
    
    return allocation, latest_prices, past_data

def get_recommendations_by_sector(sectors, amount, risk_tolerance="medium"):
    """
    Get MPT recommendations for stocks from specific sectors.
    """
    if df_stocks is None:
        raise ValueError("Data not loaded")
    
    # If no sectors specified, use all sectors
    if not sectors:
        sectors = list(SECTORS_DATA.keys())
    
    # Get all tickers from selected sectors
    selected_tickers = []
    for sector in sectors:
        if sector in SECTORS_DATA:
            selected_tickers.extend(SECTORS_DATA[sector])
    
    if not selected_tickers:
        raise ValueError("No valid sectors selected")
    
    # Filter for available tickers
    available_tickers = [t for t in selected_tickers if t in df_stocks.columns]
    if not available_tickers:
        raise ValueError("None of the tickers from selected sectors are available")
    
    # Get historical data
    past_data = df_stocks[available_tickers].dropna(axis=1)
    
    if past_data.empty:
        raise ValueError("No historical data available for selected tickers")
    
    # Run MPT simulation
    mpt_results = run_mpt_simulation(past_data)
    
    # Choose portfolio based on risk tolerance
    if risk_tolerance == 'low':
        chosen_portfolio = mpt_results['min_vol']
    else:
        chosen_portfolio = mpt_results['optimal']
    
    # Create allocation
    allocation = {}
    tickers = past_data.columns.tolist()
    for i, weight in enumerate(chosen_portfolio['weights']):
        if weight > 0.01:  # Only include significant allocations
            ticker = tickers[i]
            allocation[ticker] = {
                "weight": float(weight),
                "amount": float(amount * weight)
            }
    
    return {
        "allocation": allocation,
        "portfolio_stats": {
            "expected_return": float(chosen_portfolio['return']),
            "volatility": float(chosen_portfolio['volatility']),
            "sharpe_ratio": float(chosen_portfolio.get('sharpe', 0))
        },
        "selected_tickers": tickers
    }

if __name__ == "__main__":
    main()
