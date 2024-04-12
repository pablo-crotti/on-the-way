"use client"

import React from 'react';
import { Title } from '@/components/title';
import { Text } from '@/components/text';

export default function NewCollectionPage() {
    return(
        <div>
            <Title type="h1">Create a new collection</Title>
            <Text>
                To create a new collection, please enter the name of the collection below.
            </Text>
            <form>
                <input type="text" placeholder="Collection name" />
                <button type="submit">Create collection</button>
            </form>
        </div>
    )
}