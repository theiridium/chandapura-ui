import { getPublicSingleSearchResponse } from '@/lib/apiLibrary';
import { categories } from '@/lib/atom';
import { SearchPayload } from '@/lib/typings/dto';
import { Chip, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@heroui/react";
import { useAtomValue } from 'jotai';
import { SearchIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'

const CategoryRefTable = () => {
    const [tabledata, setTableData] = useState<any>([]);
    const [searchTxt, setSearchText] = useState<string>("");
    const onSearchChange = async (text: any) => {
        setSearchText(text);
        const payload: SearchPayload = {
            indexUid: "category",
            q: text,
            hitsPerPage: 100,
            sort: ["name:asc"]
        }
        const data = await getPublicSingleSearchResponse(payload);
        setTableData(data.results[0].hits);
    }
    useEffect(() => {
        onSearchChange("");
    }, []);

    const renderCell = useCallback((item: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "category":
                return (
                    <User
                        avatarProps={{ radius: "full", src: item.image.url }}
                        name={item.name}
                    ></User>
                );
            case "sub_category":
                return (
                    <div className='flex flex-wrap gap-2'>
                        {item.sub_categories.map((x: any, i: any) =>
                            <Chip key={i} className="capitalize" color='primary' size="sm" variant="flat">
                                {x.name}
                            </Chip>)}
                    </div>
                );
            default:
                return item.name;
        }
    }, []);

    return (
        <div>
            <Table
                topContent={
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Type to search..."
                        startContent={<SearchIcon />}
                        value={searchTxt}
                        onValueChange={onSearchChange}
                    />
                }
                topContentPlacement="outside"
                isHeaderSticky
                isStriped
                aria-label="Category Reference Book"
                classNames={{
                    wrapper: "h-[70vh]"
                }}
            >
                <TableHeader>
                    <TableColumn key="category" width={300}>
                        Category
                    </TableColumn>
                    <TableColumn key="sub_category">
                        Sub Category
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No category found from search"}
                    items={tabledata}
                >
                    {(item: any) => (
                        <TableRow key={item.name}>
                            {(columnKey) => <TableCell className='py-3'>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CategoryRefTable