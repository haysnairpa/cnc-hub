import * as tf from '@tensorflow/tfjs'

function preprocessText(text) {
    return text.toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 2);
}

function calculateTfIdf(documents) {
    // Hitung Term Frequency (TF) untuk setiap dokumen
    const termFreq = documents.map(doc => {
        const terms = preprocessText(doc);
        const freq = {};
        terms.forEach(term => {
            freq[term] = (freq[term] || 0) + 1;
        });
        return freq;
    });

    // Hitung Inverse Document Frequency (IDF)
    const idf = {};
    const N = documents.length;
    
    termFreq.forEach(doc => {
        Object.keys(doc).forEach(term => {
            idf[term] = (idf[term] || 0) + 1;
        });
    });

    Object.keys(idf).forEach(term => {
        idf[term] = Math.log(N / idf[term]);
    });

    // Hitung TF-IDF
    return termFreq.map(doc => {
        const tfidf = {};
        Object.keys(doc).forEach(term => {
            tfidf[term] = doc[term] * (idf[term] || 0);
        });
        return tfidf;
    });
}

function cosineSimilarity(vec1, vec2) {
    return tf.tidy(() => {
        const a = tf.tensor1d(vec1);
        const b = tf.tensor1d(vec2);
        const dotProduct = a.dot(b);
        const normA = a.norm();
        const normB = b.norm();
        return dotProduct.div(normA.mul(normB)).dataSync()[0];
    });
}

export function getRecommendations(userPreferences, communities) {
    // Prepare documents for TF-IDF
    const documents = communities.map(community => 
        `${community.name} ${community.description} ${community.category}`
    );
    
    const tfidfVectors = calculateTfIdf(documents);
    
    // Buat vocabulary dari semua terms yang ada
    const allTerms = new Set();
    tfidfVectors.forEach(doc => {
        Object.keys(doc).forEach(term => allTerms.add(term));
    });
    
    // Convert user preferences to vector with same vocabulary
    const userTerms = preprocessText(
        `${userPreferences.interests.join(' ')} ${userPreferences.category}`
    );
    
    const userVector = Array.from(allTerms).map(term => 
        userTerms.includes(term) ? 1 : 0
    );

    const recommendations = communities.map((community, idx) => {
        // Convert TF-IDF vector ke array dengan vocabulary yang sama
        const communityVector = Array.from(allTerms).map(term => 
            tfidfVectors[idx][term] || 0
        );

        const features = {
            contentSimilarity: cosineSimilarity(communityVector, userVector),
            categoryMatch: userPreferences.category.toLowerCase() === 
                         community.category?.toLowerCase() ? 1 : 0,
            memberScore: community.members?.length / 
                       Math.max(...communities.map(c => c.members?.length || 0)),
            activityScore: (community.events?.length || 0) / 
                         Math.max(...communities.map(c => c.events?.length || 0))
        };

        const score = (
            features.contentSimilarity * 0.4 +
            features.categoryMatch * 0.3 +
            features.memberScore * 0.2 +
            features.activityScore * 0.1
        );

        return {
            ...community,
            similarityScore: score
        };
    });

    return recommendations.sort((a, b) => b.similarityScore - a.similarityScore);
}