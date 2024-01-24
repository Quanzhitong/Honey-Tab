import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Table, Typography } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

import { domainRegex } from '@/consts';

import type { EditableCellProps, GroupNamesTableProps, Item } from './type';

const isEditing = (record: Item, editingKey: string) => record.key === editingKey;

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}: EditableCellProps) => {
    const promptTitle = dataIndex === 'domain' ? '域名' : '分组名';
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `请输入${promptTitle}`,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const GroupNamesTable = (props: GroupNamesTableProps) => {
    const { groupNames, handleSave } = props;
    const [groupNamesDateSource, setGroupNamesDateSource] = useState<Item[]>([]);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const addRow = () => {
        const emptyRow = groupNamesDateSource.find((item) => item.key === '');
        if (emptyRow) {
            message.warning('请先填写完当前行');
            return;
        }
        form.resetFields();
        setGroupNamesDateSource((s) => [
            { key: '', domain: '', newGroupName: '', type: 'add' },
            ...s,
        ]);
    };

    const save = async (record: Item) => {
        const { domain, newGroupName } = (await form.getFieldsValue()) as Item;
        if (!domain || !domainRegex.test(domain)) {
            message.error('请输入正确的域名,例如：www.baidu.com');
            return;
        }
        if (domain.trim().length > 50) {
            message.error('域名长度最多设置50字符');
            return;
        }
        if (!newGroupName.trim()) {
            message.error('请输入分组名');
            return;
        }
        const groupNamesMap = new Map(Object.entries(groupNames));
        if (groupNamesMap.has(record.key)) {
            groupNamesMap.delete(record.key);
        }
        const restGroupNames = Object.fromEntries(groupNamesMap);
        handleSave({ ...restGroupNames, [domain]: newGroupName.trim() });
        setEditingKey('');
    };

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ domain: '', newGroupName: '', ...record });
        setEditingKey(record.key);
    };

    const cancelRow = () => {
        const restGroupNames = groupNamesDateSource.filter((item) => item.key !== '');
        setGroupNamesDateSource(restGroupNames);
    };

    const cancel = (record: Item) => {
        if (record.type === 'add') {
            return cancelRow();
        }
        setEditingKey('');
    };

    const deleteHandle = (record: Partial<Item> & { key: React.Key }) => {
        const restGroupNames = groupNamesDateSource.filter((item) => item.key !== record.key);
        const resultData = restGroupNames.reduce((acc, item) => {
            return { ...acc, [item.domain]: item.newGroupName };
        }, {});
        handleSave(resultData);
    };

    const columns = [
        {
            title: '域名(精确匹配)',
            dataIndex: 'domain',
            width: '25%',
            sorter: (a: Item, b: Item) => a.domain.localeCompare(b.domain),
            editable: true,
        },
        {
            title: '分组名',
            dataIndex: 'newGroupName',
            width: '25%',
            sorter: (a: Item, b: Item) => a.newGroupName.localeCompare(b.newGroupName),
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: '15%',
            render: (_: any, record: Item) => {
                const editable = isEditing(record, editingKey);
                const emptyRow = groupNamesDateSource.find((item) => item.key === '');
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
                            保存
                        </Typography.Link>
                        <Typography.Link onClick={() => cancel(record)}>取消</Typography.Link>
                    </span>
                ) : (
                    <span>
                        <Typography.Link
                            disabled={editingKey !== '' || !!emptyRow}
                            onClick={() => edit(record)}
                            style={{ marginRight: 8 }}
                        >
                            编辑
                        </Typography.Link>
                        <Typography.Link
                            disabled={editingKey !== '' || !!emptyRow}
                            onClick={() => deleteHandle(record)}
                        >
                            删除
                        </Typography.Link>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            defaultSortOrder: 'ascend' as SortOrder,
            sortDirections: ['ascend', 'descend', 'ascend'] as SortOrder[],
            onCell: (record: Item) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record, editingKey),
            }),
        };
    });

    useEffect(() => {
        const data = Object.entries(groupNames).map(([key, value]) => {
            return {
                key,
                domain: key,
                newGroupName: value,
            };
        });
        setGroupNamesDateSource(data);
    }, [groupNames]);

    return (
        <Form form={form} component={false}>
            <Table
                size="small"
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                scroll={{ x: 200, y: 200 }}
                bordered
                dataSource={groupNamesDateSource}
                columns={mergedColumns}
                pagination={false}
            />
            {editingKey ? null : (
                <Button onClick={addRow}>
                    <PlusOutlined rev />
                    添加一行
                </Button>
            )}
        </Form>
    );
};

export default GroupNamesTable;
