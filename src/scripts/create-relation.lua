#!lua name=nekdis_create_relation

local function hashToJson(hash)
    local temp = {}

    for i = 1, #hash, 2 do
        temp[hash[i]] = hash[i + 1]
    end

    return temp
end

--[[
    Recieves 3 required keys
    KEYS[1] = The 'in' id
    KEYS[2] = The 'out' id
    KEYS[3] = The ommited id

    It recieves 2 args the second one being optional
    ARGS[1] = Field name
    ARGS[2] = meta to be saved along the way
]]
local function createJSONRelation(KEYS, ARGS)
    local inId = KEYS[1]
    local outId = KEYS[2]
    local omitId = KEYS[3]

    local meta = {}

    if ARGS[2] ~= nil then
        meta = cjson.decode(ARGS[2])
    end

    meta["in"] = inId
    meta["out"] = outId

    -- Create the "omitted" document
    redis.call("JSON.SET", omitId, "$", cjson.encode(meta))

    -- Append to the existing array of relations
    redis.call("SADD", inId .. ":" .. ARGS[1], omitId)

    return "OK"
end

local function createHASHRelation(KEYS, ARGS)
    local inId = KEYS[1]
    local outId = KEYS[2]
    local omitId = KEYS[3]

    local meta = {}
    meta[1] = "in"
    meta[2] = inId
    meta[3] = "out"
    meta[4] = outId

    if ARGS[2] ~= nil then
        for key, value in pairs(cjson.decode(ARGS[2])) do
            table.insert(meta, key)
            table.insert(meta, value)
        end
    end

    -- Create the "omitted" document
    ---@diagnostic disable-next-line: deprecated
    redis.call("HSET", omitId, unpack(meta))

    -- Append to the existing array of relations
    redis.call("SADD", inId .. ":" .. ARGS[1], omitId)

    return true
end

--[[
    KEYS[1] = The id of the key we want to get the relations from

    ARGS[1] = The field the relations are stored at
    ARGS[2] = Whether to return meta or entire object
]]
local function getJSONRelations(KEYS, ARGS)
    local value = redis.call("SMEMBERS", KEYS[1] .. ":" .. ARGS[1])

    if value ~= nil then
        local out = {}

        if (ARGS[2] == "1") then
            for i, id in ipairs(value) do
                out[i] = cjson.decode(redis.call("JSON.GET", id))
            end
        else
            for i, id in ipairs(value) do
                out[i] = cjson.decode(redis.call("JSON.GET", cjson.decode(redis.call("JSON.GET", id)).out));
            end
        end

        return cjson.encode(out)
    end

    return value
end

local function getHASHRelations(KEYS, ARGS)
    local value = redis.call("SMEMBERS", KEYS[1] .. ":" .. ARGS[1])

    if value ~= nil then
        local out = {}

        if (ARGS[2] == "1") then
            for i, id in ipairs(value) do
                out[i] = hashToJson(redis.call("HGETALL", id, "out"))
            end
        else
            for i, id in ipairs(value) do
                out[i] = hashToJson(redis.call("HGETALL", redis.call("HGET", id, "out")))
            end
        end

        return cjson.encode(out)
    end

    return value
end

--[[
    KEYS[1] = Stringified JSON of [key] = search query as an array

    ARGS[1] = Whether to return meta or entire object
]]
local function searchJSONRelations(KEYS, ARGS)
    local origin = cjson.decode(KEYS[1])
    local objs = {}

    for key, value in pairs(origin) do
        objs[key] = {}
        local val = redis.call("FT.SEARCH", value[1], value[2])

        if ARGS[1] == "1" then
            for i = 3, #val, 2 do
                table.insert(objs[key], cjson.decode(val[i][2]))
            end
        else
            for i = 3, #val, 2 do
                table.insert(objs[key], cjson.decode(redis.call("JSON.GET", cjson.decode(val[i][2]).out)))
            end
        end
    end

    return cjson.encode(objs)
end


local function searchHASHRelations(KEYS, ARGS)
    local origin = cjson.decode(KEYS[1])
    local objs = {}

    for key, value in pairs(origin) do
        objs[key] = {}
        local val = redis.call("FT.SEARCH", value[1], value[2])

        if ARGS[1] == "1" then
            for i = 3, #val, 2 do
                table.insert(objs[key], hashToJson(val[i]))
            end
        else
            for i = 3, #val, 2 do
                for j = 1, #val[i], 1 do
                    if (val[i][j] == "out") then
                        j = j + 1
                        table.insert(objs[key], hashToJson(redis.call("HGETALL", val[i][j])))
                        break
                    end
                end
            end
        end
    end

    return cjson.encode(objs)
end

redis.register_function("JSONCR", createJSONRelation)
redis.register_function("HCR", createHASHRelation)
redis.register_function("JSONGR", getJSONRelations)
redis.register_function("HGR", getHASHRelations)
redis.register_function("JSONSR", searchJSONRelations)
redis.register_function("HSR", searchHASHRelations)
