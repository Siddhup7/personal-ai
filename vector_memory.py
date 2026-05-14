import faiss
import numpy as np

from sentence_transformers import (
    SentenceTransformer
)

# =========================
# LOAD EMBEDDING MODEL
# =========================

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# =========================
# MEMORY STORAGE
# =========================

memory_texts = []

# =========================
# VECTOR DIMENSION
# =========================

dimension = 384

# =========================
# CREATE FAISS INDEX
# =========================

index = faiss.IndexFlatL2(
    dimension
)

# =========================
# ADD MEMORY
# =========================

def add_memory(text):

    global memory_texts

    # STORE RAW TEXT
    memory_texts.append(text)

    # CREATE EMBEDDING
    embedding = model.encode(
        [text]
    )

    embedding = np.array(
        embedding
    ).astype("float32")

    # ADD TO FAISS
    index.add(embedding)

# =========================
# SEARCH MEMORY
# =========================

def search_memory(
    query,
    top_k=3
):

    if len(memory_texts) == 0:

        return []

    # CREATE QUERY EMBEDDING
    query_embedding = model.encode(
        [query]
    )

    query_embedding = np.array(
        query_embedding
    ).astype("float32")

    # SEARCH VECTOR DATABASE
    distances, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for idx in indices[0]:

        if idx < len(memory_texts):

            results.append(
                memory_texts[idx]
            )

    return results