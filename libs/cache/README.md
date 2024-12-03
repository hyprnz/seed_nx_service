# Cache

This library provides different caches depending on need

- Cache - for basic caching
- LruExpiryCache - a basic cache that uses the 'Least recently used strategy' which drops items
  if they are not used for a period of time
- RedisCache - distributed cache that uses a redis server
