"use client"
import { getPublicSingleSearchResponse } from '@/lib/apiLibrary';
import { SearchPayload } from '@/lib/typings/dto';
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'

const CategoryListModal = (props: any) => {
    const [tabledata, setTableData] = useState<any>(props.list);
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
        setTableData(props.list || []); 
    }, [props.list]);
    
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
        <Modal isOpen={props.isOpen} size='5xl' onClose={props.onClose} scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col md:flex-row gap-2 gap-x-5 items-center">{props.title}
                        <Input
                                isClearable
                                className="w-full sm:max-w-[44%]"
                                placeholder="Type to search..."
                                startContent={<SearchIcon />}
                                value={searchTxt}
                                onValueChange={onSearchChange}
                            />
                        </ModalHeader>
                        <ModalBody className='nextui-modal'>
                            
                            <Table
                                removeWrapper
                                isHeaderSticky
                                aria-label="Example table with client side sorting"
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
                                    items={tabledata}
                                >
                                    {(item: any) => (
                                        <TableRow key={item.name}>
                                            {(columnKey) => <TableCell className='py-3'>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ModalBody>
                        <ModalFooter className='border-t'>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default CategoryListModal