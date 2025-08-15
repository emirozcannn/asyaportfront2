// SupabaseService.cs'e eklenecek test metodu

public async Task<bool> TestConnectionAsync()
{
    try
    {
        // Supabase bağlantısını test et
        var response = await _client.From<Users>().Select("id").Limit(1).Get();
        return response != null;
    }
    catch (Exception ex)
    {
        _logger.LogError($"Supabase connection test failed: {ex.Message}");
        return false;
    }
}

// Ayrıca SupabaseService constructor'ında da logging ekleyin
public SupabaseService(IConfiguration configuration, ILogger<SupabaseService> logger)
{
    _logger = logger;
    _logger.LogInformation("Initializing SupabaseService");
    
    try
    {
        var url = configuration["Supabase:Url"];
        var key = configuration["Supabase:Key"];
        
        if (string.IsNullOrEmpty(url) || string.IsNullOrEmpty(key))
        {
            throw new InvalidOperationException("Supabase URL or Key is missing in configuration");
        }
        
        _logger.LogInformation($"Supabase URL: {url}");
        _logger.LogInformation("Supabase Key: [HIDDEN]");
        
        var options = new SupabaseOptions
        {
            AutoConnectRealtime = true
        };
        
        _client = new Supabase.Client(url, key, options);
        _logger.LogInformation("SupabaseService initialized successfully");
    }
    catch (Exception ex)
    {
        _logger.LogError($"Failed to initialize SupabaseService: {ex.Message}");
        throw;
    }
}
