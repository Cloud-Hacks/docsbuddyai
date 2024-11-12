module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                perf_hooks: false,
            };
        }
        return config;
    },
};
